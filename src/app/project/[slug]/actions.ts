import {createClient} from '@/lib/supabase/server';

export async function getProject(slug: string) {
  const supabase = await createClient();
  const {data} = await supabase.from('projects').select().eq('id', slug);
  return data?.[0];
}
