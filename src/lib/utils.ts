import {SupabaseClient} from '@supabase/supabase-js';
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';
import {titleCase} from 'title-case';
import {Database, Tables} from '@/lib/supabase/types/supabase';
import {PlotType} from './supabase/types/custom';

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

export async function getPlot(
  supabase: SupabaseClient<Database>,
  project: Tables<'projects'> | undefined,
  plotType: PlotType,
): Promise<string | null> {
  if (!project || !project.id) {
    return null;
  }
  const filePath = `${project.id}/${plotType}.png`;
  try {
    const url = await getSignedStorageURL(
      supabase,
      'project-plots',
      filePath,
      3600, // 1 hour
    );
    return url;
  } catch (error) {
    if (error instanceof Error) {
      // Plot just hasn't been generated yet
      if (error.message !== 'Object not found') console.error(error);
    }
    return null;
  }
}
