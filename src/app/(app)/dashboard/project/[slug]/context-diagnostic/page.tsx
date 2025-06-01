import ContextDiagnosticForm from '@/components/ContextDiagnosticForm';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Context Diagnostic</h2>
      <p className="px-8 pb-8 text-lg">
        To what extent do you agree with the following statements about your
        project?
      </p>
      <ContextDiagnosticForm />
    </main>
  );
}
