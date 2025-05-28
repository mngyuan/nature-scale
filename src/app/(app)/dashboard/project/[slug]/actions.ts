import {createClient} from '@/lib/supabase/server';

export async function getProject(slug: string) {
  const supabase = await createClient();
  const {data} = await supabase
    .from('projects')
    .select()
    .eq('id', Number(slug));
  return data?.[0];
}
