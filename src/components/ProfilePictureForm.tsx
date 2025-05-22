'use client';
import React, {useEffect, useState} from 'react';
import {createClient} from '@/lib/supabase/client';
import Image from 'next/image';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {User} from '@supabase/supabase-js';

export default function ProfilePictureForm({
  user,
  uid,
  url,
  size,
}: {
  user: User | null;
  uid: string | null;
  url: string | undefined;
  size: number;
}): JSX.Element {
  const supabase = createClient();
  const [profilePictureURL, setProfilePictureURL] = useState(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const {data, error} = await supabase.storage
          .from('profile-photos')
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setProfilePictureURL(url);
      } catch (error) {
        console.error('Error downloading profile picture: ', error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  const uploadProfilePicture = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const {error: uploadError} = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {error} = await supabase.from('profiles').upsert({
        id: user?.id as string,
        profile_picture_url: filePath,
        updated_at: new Date().toISOString(),
      });
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
      {profilePictureURL ? (
        <Image
          width={size}
          height={size}
          src={profilePictureURL}
          alt="profile picture"
          style={{height: size, width: size}}
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
