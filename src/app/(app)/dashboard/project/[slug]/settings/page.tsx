import {Button} from '@/components/ui/button';
import {getProject} from '../actions';
import {createClient} from '@/lib/supabase/server';
import Link from 'next/link';
import CreateProjectForm from '@/components/CreateProjectForm';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Project Settings</h2>
      <div className="flex flex-col gap-8 px-8 pb-8 space-x-6 w-lg">
        <CreateProjectForm project={project} user={user}>
          <div className="flex gap-2">
            <Link href={`/dashboard/project/${slug}`}>
              <Button variant="outline" type="submit">
                Back
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </CreateProjectForm>
      </div>
    </main>
  );
}
