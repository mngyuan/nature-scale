import {Badge} from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {formatPathCrumb} from '@/lib/utils';
import {ArrowRight, Flag} from 'lucide-react';
import Link from 'next/link';

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-col p-8 w-lg space-y-2">
        <Badge>Grasslands</Badge>
        <h2 className="text-3xl">{formatPathCrumb(slug)}</h2>
        <div>
          Community-driven livestock management model for rangeland restoration,
          biodiversity conservation and improved livelihoods.
        </div>
      </div>
      <div className="flex flex-col px-8">
        <div className="text-xl font-bold mb-4">Choose a module</div>
        <div className="flex flex-row flex-wrap space-x-4 items-center">
          <Card className="mb-4 basis-xs">
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
          </Card>
          <ArrowRight />
          <Card className="mb-4 basis-xs">
            <Link href={`/${slug}/assess-progress`}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                    <Flag size={48} />
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
          <ArrowRight />
          <Card className="mb-4 basis-xs">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                  <Flag size={48} />
                </div>
                Run a context diagnostic
              </CardTitle>
              <CardDescription>
                In this section, you can calculate the number of adopters.
              </CardDescription>
            </CardHeader>
          </Card>
          <ArrowRight />
          <Card className="mb-4 basis-xs">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-center p-4 mb-4 bg-gray-100 w-24 h-24 rounded-lg">
                  <Flag size={48} />
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
