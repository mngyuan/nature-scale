import ContextDiagnosticForm from '@/components/ContextDiagnosticForm';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Context Diagnostic</h2>
      <ContextDiagnosticForm />
    </main>
  );
}
