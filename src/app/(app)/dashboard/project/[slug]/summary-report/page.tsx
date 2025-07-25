import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {getProject} from '../actions';
import {
  ArrowRight,
  ChartNoAxesCombinedIcon,
  LightbulbIcon,
  Sun,
} from 'lucide-react';
import {CONTEXT_DIAGNOSTIC_ITEMS, RESOURCE_TYPES} from '@/lib/constants';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import Image from 'next/image';
import {createClient} from '@/lib/supabase/server';
import {getPlot} from '../actions';
import PrintButton from '@/components/PrintButton';
import {asPercentage, formatAdoptionUnit} from '@/lib/utils';
import {format} from 'date-fns';
import ProjectSummary from '@/components/ProjectSummary';
import {Badge} from '@/components/ui/badge';
import {titleCase} from 'title-case';

export default async function SummaryReportPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);
  const supabase = await createClient();

  const aoiPlot = await getPlot(supabase, project, 'area-of-interest');
  const potentialAdoptersPlot = await getPlot(
    supabase,
    project,
    'potential-adopters',
  );
  const forecastPlot = await getPlot(supabase, project, 'forecast');

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

  const insightsSection =
    project?.details?.growth ||
    aoiPlot ||
    potentialAdoptersPlot ||
    forecastPlot ? (
      <div className="flex flex-col lg:flex-row gap-4">
        {project?.details?.growth && (
          <div className="grow space-y-2">
            <div className="flex flex-row items-center space-x-1">
              <Sun size={16} className="" />
              <p className="font-semibold text-lg">Insights</p>
            </div>
            <ul className="list-disc list-inside text-sm">
              <li>
                The estimated rate of independent uptake is{' '}
                <b>{project.details.growth.independent}%</b>, meaning that on
                average this percent of the population has adopted the
                initiative in each sampling time, independent of whether their
                peers have adopted.
              </li>
              <li>
                The estimated rate of social transmission is{' '}
                <b>{project.details.growth.social}%</b>, meaning that on average
                each adopter caused {project.details.growth.social} new
                adoptions in the next sampling time.
              </li>
            </ul>
          </div>
        )}
      </div>
    ) : null;

  return (
    <main className="flex flex-col grow w-full print:text-sm">
      <h2 className="p-8 pb-4 text-3xl print:text-2xl">
        Summary Report:{' '}
        <b className="font-medium">
          {project?.name ? titleCase(project?.name) : ''}
        </b>
      </h2>
      <div className="px-8 pb-8 space-x-6">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2 space-x-1 flex flex-col lg:block">
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
            <div className="text-muted-foreground">{project?.description}</div>
          </div>

          {project?.details?.potentialAdopters && (
            <p className="text-sm">
              Your potential pool of adopters is{' '}
              {project.details.potentialAdopters}{' '}
              {formatAdoptionUnit(project, true)}.
            </p>
          )}
          {aoiPlot && (
            <Image
              src={aoiPlot || ''}
              alt="Area of Interest Plot"
              width={800}
              height={600}
              className="rounded-lg"
            />
          )}
          {project?.details?.targetAdoption && (
            <p className="text-sm">
              You stated your goal was to reach {project.details.targetAdoption}
              {project.details.potentialAdopters
                ? ` (${asPercentage(
                    project.details.targetAdoption,
                    project.details.potentialAdopters,
                  )}) of your pool of potential ${formatAdoptionUnit(project, true)}.`
                : null}
            </p>
          )}
          {project?.details?.growth?.lastReportedAdoption && (
            <p className="text-sm">
              Currently you have reached{' '}
              {project.details.growth.lastReportedAdoption}
              {project.details.potentialAdopters
                ? ` (${asPercentage(
                    project.details.growth.lastReportedAdoption,
                    project.details.potentialAdopters,
                  )}) of your potential pool of ${formatAdoptionUnit(project, true)}`
                : null}
              .
            </p>
          )}
          {forecastPlot && (
            <Image
              src={forecastPlot || ''}
              alt="Forecast Plot"
              width={800}
              height={600}
              className="rounded-lg"
            />
          )}
          {project?.details?.growth?.probabilityOfSuccess && (
            <p className="text-sm">
              Given current trends, we project that you have{' '}
              {project.details.growth.probabilityOfSuccess}% probability that
              you will reach or exceed your target
              {project.details.endingDate
                ? ` by ${format(project.details.endingDate, 'MMMM dd, yyyy')}`
                : '.'}
              .
            </p>
          )}
          {insightsSection}
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
          <div className="print:hidden">
            <PrintButton />
          </div>
        </div>
      </div>
    </main>
  );
}
