'use server';

import {createClient} from '@/lib/supabase/server';
import {PlotType, ProjectLastUpdated} from '@/lib/supabase/types/custom';
import {Database, Tables} from '@/lib/supabase/types/supabase';
import {SupabaseClient} from '@supabase/supabase-js';
import {getSignedStorageURL} from '@/lib/utils';

export async function getProject(slug: string) {
  const supabase = await createClient();
  const {data} = await supabase
    .from('projects')
    .select()
    .eq('id', Number(slug));
  return data?.[0];
}

export async function savePlot(
  project: Tables<'projects'> | undefined,
  plotType: PlotType,
  plotData: string,
) {
  if (!project) {
    return;
  }
  const supabase = await createClient();

  const buffer = Buffer.from(plotData, 'base64');
  const filePath = `${project.id}/${plotType}.png`;

  const {error: uploadError} = await supabase.storage
    .from('project-plots')
    .update(filePath, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading project plot:', uploadError);
  }
}

export type ProjectMemberQueryResult = Pick<
  Tables<'project_members'>,
  'id' | 'role' | 'created_at'
> & {
  profiles: Pick<
    Tables<'profiles'>,
    'id' | 'first_name' | 'last_name' | 'profile_picture_url'
  >;
};

export async function getProjectMembers(projectId: number) {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('project_members')
    .select(
      `
      id,
      role,
      created_at,
      profiles (
        id,
        first_name,
        last_name,
        profile_picture_url
      )
    `,
    )
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching project members:', error);
    return [];
  }

  return data || [];
}

export async function addProjectMember(
  projectId: number,
  profileId: string,
  role: string = 'collaborator',
) {
  const supabase = await createClient();

  const {data, error} = await supabase
    .from('project_members')
    .insert([
      {
        project_id: projectId,
        profile_id: profileId,
        role,
      },
    ])
    .select();

  if (error) {
    console.error('Error adding project member:', error);
    return {success: false, error: error.message};
  }

  return {success: true, data};
}

export async function removeProjectMember(memberId: number) {
  const supabase = await createClient();

  const {error} = await supabase
    .from('project_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error removing project member:', error);
    return {success: false, error: error.message};
  }

  return {success: true};
}

export type VisibleUsersQueryResult = Pick<
  Tables<'profiles'>,
  'id' | 'first_name' | 'last_name' | 'profile_picture_url' | 'search_visible'
>;

export async function searchVisibleUsers(
  searchTerm: string,
): Promise<VisibleUsersQueryResult[]> {
  const supabase = await createClient();
  const {data, error} = await supabase
    .from('profiles')
    .select('id, first_name, last_name, profile_picture_url, search_visible')
    .eq('search_visible', true)
    .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
    .limit(10);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data || [];
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

export async function updateLastUpdated(
  project: Tables<'projects'> | undefined,
  module: keyof NonNullable<ProjectLastUpdated>,
) {
  if (!project || !project.id) {
    return null;
  }

  const supabase = await createClient();
  const {data, error} = await supabase
    .from('projects')
    .update({
      last_updated: {
        ...project.last_updated,
        [module]: new Date().toISOString(),
      },
    })
    .eq('id', Number(project?.id))
    .select();
  if (error) {
    console.error(`Error updating last updated for ${module}:`, error);
    // TODO: display to user
    // alert('Error updating potential adopters');
  } else {
    // TODO: show a success toast?
    console.log(`last updated updated successfully for ${module}`, data);
  }
}
