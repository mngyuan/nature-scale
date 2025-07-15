import {Badge} from '@/components/ui/badge';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';
import {RESOURCE_TYPES} from '@/lib/constants';
import {formatPathCrumb, getPublicStorageURL} from '@/lib/utils';
import {
  BookOpenCheck,
  Flag,
  Settings,
  TrendingUp,
  WandSparkles,
} from 'lucide-react';
import Link from 'next/link';
import {getProject} from './actions';
import {format} from 'date-fns';
import {createClient} from '@/lib/supabase/server';
import {Button} from '@/components/ui/button';
import {Metadata} from 'next';
import {redirect} from 'next/navigation';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);
  const supabase = await createClient();
  const projectImage = project?.project_image_url
    ? getPublicStorageURL(supabase, 'project-images', project.project_image_url)
    : null;

  // Redirect to dashboard if project is not found
  if (project == undefined) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-col grow w-full">
      <div
        className="flex flex-col p-8 bg-cover bg-center grow relative gap-4"
        style={{backgroundImage: `url(${projectImage || '/rangelands.png'})`}}
      >
        <div className="hidden lg:block absolute right-8 top-8">
          <Link href={`/dashboard/project/${slug}/settings`}>
            <Button>
              <Settings className="h-5 w-5" /> Project Settings
            </Button>
          </Link>
        </div>
        <div className="grow" />
        <div className="w-full max-w-2xl space-y-2 text-white space-x-1 flex flex-col lg:block">
          {[...(project?.details?.resourcesType || [])]?.map(
            (resource: string) => (
              <Badge key={resource}>
                {RESOURCE_TYPES[resource].label || resource}
              </Badge>
            ),
          )}
          <span className="text-xs pl-1">
            {project?.details?.monitoringFrequency &&
              `Monitoring ${project.details.monitoringFrequency} from `}
            {project?.details?.startingDate
              ? `${format(project?.details?.startingDate, 'MMMM dd, yyyy')} to `
              : 'Starting date not specified to '}
            {project?.details?.endingDate
              ? format(project?.details?.endingDate, 'MMMM dd, yyyy')
              : 'ongoing'}
          </span>
          <h2 className="text-3xl font-medium">
            {formatPathCrumb(project?.name)}
          </h2>
          <div>{project?.description}</div>
        </div>
        <div className="lg:hidden">
          <Link href={`/dashboard/project/${slug}/settings`}>
            <Button>
              <Settings className="h-5 w-5" /> Project Settings
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col p-8">
        <div className="text-xl font-bold mb-4">Choose a module</div>
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          <Card className="mb-4 lg:basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/identify-potential`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <Flag size={48} />
                  </div>
                  Identify scaling potential and targets
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>
          <Card className="mb-4 lg:basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/assess-progress`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <TrendingUp size={48} />
                  </div>
                  Monitor current progress and trajectory
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>
          <Card className="mb-4 lg:basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/context-diagnostic`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <BookOpenCheck size={48} />
                  </div>
                  Take a context diagnostic
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>
          <Card className="mb-4 lg:basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/scaling-suggestions`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <WandSparkles size={48} />
                  </div>
                  Get scaling suggestions
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Project',
};
