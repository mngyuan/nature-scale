import {Badge} from '@/components/ui/badge';
import {Card, CardHeader, CardTitle} from '@/components/ui/card';
import {RESOURCE_TYPES} from '@/lib/constants';
import {formatPathCrumb, getPublicStorageURL} from '@/lib/utils';
import {
  BookOpenCheck,
  Check,
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
import {titleCase} from 'title-case';

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
        <div className="w-full max-w-2xl space-y-2 space-x-1 flex flex-col lg:block text-white">
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
            {project?.name ? titleCase(project?.name) : ''}
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
                  {project?.last_updated?.identifyPotential && (
                    <div className="text-muted-foreground text-xs mt-2 flex flex-row items-center">
                      Last updated{' '}
                      {format(project.last_updated.identifyPotential, 'PPPp')}
                      <Check className="inline-block ml-2 bg-green-500 rounded-xl p-1 text-white" />
                    </div>
                  )}
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
                  Monitor current adoption progress and trajectory
                  {project?.last_updated?.assessProgress && (
                    <div className="text-muted-foreground text-xs mt-2 flex flex-row items-center">
                      Last updated{' '}
                      {format(project.last_updated.assessProgress, 'PPPp')}
                      <Check className="inline-block ml-2 bg-green-500 rounded-xl p-1 text-white" />
                    </div>
                  )}
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
                  Understand how you might better scale your project
                  {project?.last_updated?.contextDiagnostic && (
                    <div className="text-muted-foreground text-xs mt-2 flex flex-row items-center">
                      Last updated{' '}
                      {format(project.last_updated.contextDiagnostic, 'PPPp')}
                      <Check className="inline-block ml-2 bg-green-500 rounded-xl p-1 text-white" />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
            </Link>
          </Card>
        </div>
        <div className="text-xl font-bold mb-4">View the results</div>
        <Card className="mb-4 grow">
          <Link href={`/dashboard/project/${slug}/summary-report`}>
            <CardHeader>
              <CardTitle className="">
                <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                  <WandSparkles size={48} />
                </div>
                Summary Report
              </CardTitle>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Project',
};
