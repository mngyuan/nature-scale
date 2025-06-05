import {getProject} from '../actions';
import IdentifyPotentialClientPage from './IdentifyPotentialClientPage';

export default async function IdentifyPotentialPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Identify scaling potential and targets</h2>
      <div className="grid grid-cols-2 gap-4 px-8 pb-8 space-x-6 grow">
        <IdentifyPotentialClientPage project={project} />
      </div>
    </main>
  );
}
