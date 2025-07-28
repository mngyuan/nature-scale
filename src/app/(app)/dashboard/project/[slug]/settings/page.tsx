import {Button} from '@/components/ui/button';
import {getProject} from '../actions';
import {createClient} from '@/lib/supabase/server';
import Link from 'next/link';
import CreateProjectForm from '@/components/CreateProjectForm';
import CollaboratorManager from '@/components/CollaboratorManager';
import ProjectDeleteButton from '@/components/ProjectDeleteButton';

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
  const isOwner =
    project && user
      ? await supabase
          .from('project_members')
          .select('role')
          .eq('project_id', project.id)
          .eq('profile_id', user.id)
          .single()
          .then(({data}) => data?.role === 'owner')
      : false;

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Project Settings</h2>
      <div className="flex flex-col gap-8 px-8 pb-8 w-full">
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
        {project && user && (
          <div>
            <h3 className="text-2xl mb-4">Collaborators</h3>
            <CollaboratorManager
              projectId={project.id}
              currentUserId={user.id}
              isOwner={isOwner}
            />
          </div>
        )}
        {
          // The example project should not be deleted
          project && project.id != 1 && (
            <div>
              <h3 className="text-2xl mb-4">Delete</h3>
              <ProjectDeleteButton project={project} />
            </div>
          )
        }
      </div>
    </main>
  );
}
