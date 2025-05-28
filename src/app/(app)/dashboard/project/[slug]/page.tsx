import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {RESOURCE_LABELS} from '@/lib/constants';
import {formatPathCrumb} from '@/lib/utils';
import {
  ArrowRight,
  BookOpenCheck,
  Flag,
  TrendingUp,
  WandSparkles,
} from 'lucide-react';
import Link from 'next/link';
import {getProject} from './actions';
import {ProjectDataForwarder} from '@/components/ProjectContext';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);

  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-col p-8 bg-[url(/rangelands.png)] bg-cover bg-center grow relative">
        <ProjectDataForwarder project={project} />
        <div className="w-lg space-y-2 text-white absolute bottom-8 space-x-1">
          {[...(project?.details?.resourcesType || [])]?.map(
            (resource: string) => (
              <Badge key={resource}>
                {RESOURCE_LABELS[resource] || resource}
              </Badge>
            ),
          )}
          <h2 className="text-3xl">{formatPathCrumb(project.name)}</h2>
          <div>{project.description}</div>
        </div>
      </div>
      <div className="flex flex-col p-8">
        <div className="text-xl font-bold mb-4">Choose a module</div>
        <div className="flex flex-row space-x-4 space-y-4 items-stretch">
          <Card className="mb-4 basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/identify-potential`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <Flag size={48} />
                  </div>
                  Identify scaling potential and targets
                </CardTitle>
                <CardDescription>
                  In this section, you can calculate the number of adopters.
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <ArrowRight className="self-center" />
          <Card className="mb-4 basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/assess-progress`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <TrendingUp size={48} />
                  </div>
                  Monitor current progress and trajectory
                </CardTitle>
                <CardDescription>
                  In this section, you can check the status of your current
                  progress and trajectory.
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <ArrowRight className="self-center" />
          <Card className="mb-4 basis-3xs grow">
            <Link href={`/dashboard/project/${slug}/context-diagnostic`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <BookOpenCheck size={48} />
                  </div>
                  Run a context diagnostic
                </CardTitle>
                <CardDescription>
                  In this section, you can calculate the number of adopters.
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <ArrowRight className="self-center" />
          <Card className="mb-4 basis-3xs grow">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                  <WandSparkles size={48} />
                </div>
                Get scaling suggestions
              </CardTitle>
              <CardDescription>
                In this section, you can calculate the number of adopters.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
