import {getProject} from '../actions';
import AssessProgressClientPage from './AssessProgressClientPage';

export default async function AssessPotentialPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Assess Progress</h2>
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 px-8 pb-8 gap-6 grow">
        <AssessProgressClientPage project={project} />
      </div>
    </main>
  );
}
