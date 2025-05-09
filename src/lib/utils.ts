import {SupabaseClient} from '@supabase/supabase-js';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {titleCase} from 'title-case';

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

export const formatPathCrumb = (crumb: string): string =>
  titleCase(crumb.replace(/-/g, ' '));

export const getProfile = async (supabase: SupabaseClient) => {
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
