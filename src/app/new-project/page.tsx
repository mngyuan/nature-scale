import CreateProjectForm from '@/components/CreateProjectForm';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Create a new project</h2>
      <CreateProjectForm />
    </main>
  );
}
