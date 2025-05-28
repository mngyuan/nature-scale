'use client';
import React, {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import Image from 'next/image';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {User} from '@supabase/supabase-js';
import {Tables} from '@/lib/supabase/types/supabase';

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
  const [uploading, setUploading] = useState(false);

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
    try {
      // TODO: display to user?
      if (!user?.id) {
        console.error('User ID is not available');
        return;
      }
      setUploading(true);

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
      if (error) throw error;
      // TODO: display to user
      // alert('Profile updated!')
    } catch (error) {
      console.error('Error uploading profile picture: ', error);
      // alert('Error uploading profile picture!');
    } finally {
      setUploading(false);
    }
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
      <Label htmlFor="single">{uploading ? 'Uploading ...' : 'Upload'}</Label>
      <Input
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadProfilePicture}
        disabled={uploading}
      />
    </div>
  );
}
