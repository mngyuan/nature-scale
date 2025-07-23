import {SupabaseClient} from '@supabase/supabase-js';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {titleCase} from 'title-case';
import {Database, Tables} from '@/lib/supabase/types/supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const formatPathCrumb = (crumb?: string): string =>
  crumb == null ? '' : titleCase(crumb.replace(/-/g, ' '));

export const countryNameFromCode = (code: string): string => {
  try {
    // R API expects english name countries but we store country codes
    return new Intl.DisplayNames(['en'], {
      type: 'region',
    }).of(code)!;
  } catch (_) {
    // Don't choke the frontend if code is invalid (i.e. ISO 3166-1 alpha-3)
    return code;
  }
};

export const getProfile = async (supabase: SupabaseClient<Database>) => {
  const {data, error} = await supabase.auth.getUser();
  const loggedIn = data?.user && !error;
  let profile = null;
  if (loggedIn) {
    const {data: profileData} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data?.user?.id)
      .single();
    profile = profileData;
  }
  return {loggedIn, profile};
};

export const getProfileDisplayName = (
  profile:
    | Tables<'profiles'>
    | {first_name: string | null; last_name: string | null},
) => {
  if (profile.first_name && profile.last_name) {
    return `${profile.first_name} ${profile.last_name}`;
  }
  return profile.first_name || profile.last_name || 'Unknown User';
};

export const getProfileInitials = (
  profile:
    | Tables<'profiles'>
    | {first_name: string | null; last_name: string | null},
) => {
  return (
    `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() ||
    'U'
  );
};

export const getPublicStorageURL = (
  supabase: SupabaseClient<Database>,
  bucketName: string,
  filePath: string | null | undefined,
): string | null => {
  if (!filePath) {
    return null;
  }

  const {data} = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

export async function getSignedStorageURL(
  supabase: SupabaseClient<Database>,
  bucketName: string,
  filePath: string | null | undefined,
  expiresIn: number = 3600,
): Promise<string | null> {
  if (!filePath) {
    return null;
  }

  const {data, error} = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, expiresIn);

  if (error) throw error;

  return data.signedUrl;
}

export async function downloadFromBucket(
  supabase: SupabaseClient<Database>,
  bucket: string,
  path: string,
) {
  try {
    const {data, error} = await supabase.storage.from(bucket).download(path);
    if (error) {
      throw error;
    }

    const url = URL.createObjectURL(data);
    return url;
  } catch (error) {
    console.error('Error downloading profile picture: ', error);
    return null;
  }
}
