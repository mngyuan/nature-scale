import CreateProjectForm from '@/components/CreateProjectForm';
import {createClient} from '@/lib/supabase/server';
import {Metadata} from 'next';

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Create a new project</h2>
      <CreateProjectForm user={user} />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'New Project',
};
