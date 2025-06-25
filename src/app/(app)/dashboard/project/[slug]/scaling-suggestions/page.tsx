import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {getProject} from '../actions';
import {
  ArrowRight,
  ChartNoAxesCombinedIcon,
  LightbulbIcon,
  Sun,
} from 'lucide-react';
import {CONTEXT_DIAGNOSTIC_ITEMS} from '@/lib/constants';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default async function ScalingSuggestionsPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);
  const disagreedItems =
    project?.context_diagnostic &&
    Object.entries(project.context_diagnostic)
      .sort(([key, _]) => Number(key))
      // Only keep the "disagree" responses
      .filter(([_, value]) => value === '3')
      .map(([key, value]) => [Number(key), value]);

  const disagreeRecommendations = ([key, _]: [
    number,
    (typeof CONTEXT_DIAGNOSTIC_ITEMS)[number],
  ]) =>
    CONTEXT_DIAGNOSTIC_ITEMS[key] &&
    CONTEXT_DIAGNOSTIC_ITEMS[key].recommendations.map((recommendation) => (
      <Tooltip key={recommendation}>
        <TooltipTrigger className="w-full">
          <div className="flex flex-row items-center space-between p-4 bg-secondary rounded-lg text-left space-x-2">
            <LightbulbIcon className="shrink-0 ml-2 mr-4" />
            <div className="flex flex-col">
              <div className="uppercase text-xs text-muted-foreground">
                {CONTEXT_DIAGNOSTIC_ITEMS[key].title}
              </div>
              <p className="text-sm">{recommendation}</p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {CONTEXT_DIAGNOSTIC_ITEMS[key].description}
        </TooltipContent>
      </Tooltip>
    ));

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Suggestions to improve scale</h2>
      <div className="px-8 pb-8 space-x-6">
        <div className="flex flex-col space-y-4">
          {project?.details?.growth && (
            <div className="space-y-2">
              <div className="flex flex-row items-center space-x-1">
                <Sun size={16} className="" />
                <p className="font-semibold text-lg">Insights</p>
              </div>
              <ul className="list-disc list-inside text-sm">
                <li>
                  The rate of social spread is{' '}
                  <b>{project.details.growth.social}</b>
                </li>
                <li>
                  The rate of independent adoption is{' '}
                  <b>{project.details.growth.independent}</b>
                </li>
              </ul>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-1">
              <ChartNoAxesCombinedIcon size={16} className="" />
              <p className="font-semibold text-lg">Suggestions</p>
            </div>
            {project?.context_diagnostic ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Based on the project stage, your data, and your responses, the
                  following suggestions may help improve the adoption rate.
                </p>
                <div className="hidden lg:grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-2">
                    {disagreedItems &&
                      disagreedItems
                        .slice(disagreedItems.length / 2, disagreedItems.length)
                        .map(([k, v]) => disagreeRecommendations([k, v]))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {disagreedItems &&
                      disagreedItems
                        .slice(0, disagreedItems.length / 2)
                        .map(([k, v]) => disagreeRecommendations([k, v]))}
                  </div>
                </div>
                <div className="flex flex-col lg:hidden gap-2">
                  {disagreedItems &&
                    disagreedItems.map(([k, v]) =>
                      disagreeRecommendations([k, v]),
                    )}
                </div>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <p>Complete the context diagnostic to receive suggestions.</p>
                <Link href={`/dashboard/project/${slug}/context-diagnostic`}>
                  <Button>
                    <ArrowRight />
                    Take me there
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col"></div>
      </div>
    </main>
  );
}
