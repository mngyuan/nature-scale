'use client';
import React, {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import Image from 'next/image';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {User} from '@supabase/supabase-js';
import {Tables} from '@/lib/supabase/types/supabase';
import {useUpdateStates} from '@/lib/hooks';

export default function ProfilePictureForm({
  user,
  profile,
  size,
}: {
  user: User | null;
  profile: Tables<'profiles'> | null;
  size: number;
}): JSX.Element {
  const supabase = createClient();
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const {data, error} = await supabase.storage
          .from('profile-photos')
          .download(path);
        console.log('Image data: ', data);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setProfilePictureURL(url);
      } catch (error) {
        console.error('Error downloading profile picture: ', error);
      }
    }

    if (profile?.profile_picture_url)
      downloadImage(profile?.profile_picture_url);
  }, [profile, supabase]);

  const uploadProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!user?.id) {
      console.error('User ID is not available');
      setError('User ID is not available. Please report this error.');
      return;
    }
    setLoading(true);

    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.');
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

    const {error: uploadError} = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const {error} = await supabase
      .from('profiles')
      .update({
        profile_picture_url: filePath,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Updated your profile!');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {profilePictureURL && profile ? (
        <Image
          width={size}
          height={size}
          src={profilePictureURL}
          alt={`${profile.first_name}'s profile picture`}
          style={{height: size, width: size}}
          className="rounded-md object-cover"
        />
      ) : (
        <div
          className="bg-gray-300 rounded-md"
          style={{height: size, width: size}}
        />
      )}
      <Label htmlFor="single">{loading ? 'Uploading ...' : 'Upload'}</Label>
      <Input
        type="file"
        className="cursor-pointer"
        id="single"
        accept="image/*"
        onChange={uploadProfilePicture}
        disabled={loading}
      />

      {message && (
        <div className="text-sm text-muted-foreground">{message}</div>
      )}

      {error && <div className="text-sm text-red-500 ">{error}</div>}
    </div>
  );
}
