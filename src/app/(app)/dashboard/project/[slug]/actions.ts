'use server';

import {createClient} from '@/lib/supabase/server';
import {PlotType} from '@/lib/supabase/types/custom';
import {Tables} from '@/lib/supabase/types/supabase';

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
