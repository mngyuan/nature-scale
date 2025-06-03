import {ProjectDataForwarder} from '@/components/ProjectContext';
import {getProject} from './actions';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  // pre-fetch to prime cache
  const project = await getProject(slug);

  return (
    <>
      <ProjectDataForwarder project={project} />
      {children}
    </>
  );
}
