import ContextDiagnosticForm from '@/components/ContextDiagnosticForm';
import {getProject} from '../actions';
import {Metadata} from 'next';

export default async function ContextDiagnosticPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Context Diagnostic</h2>
      <p className="px-8 pb-8 text-md font-semibold">
        To what extent do you agree with the following statements about your
        project?
      </p>
      <ContextDiagnosticForm project={project} />
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Context Diagnostic',
};
