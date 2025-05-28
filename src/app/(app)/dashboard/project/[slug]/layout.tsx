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
  await getProject(slug);

  return children;
}
