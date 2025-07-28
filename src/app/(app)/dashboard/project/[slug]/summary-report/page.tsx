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

  const disagreedItems = project?.context_diagnostic
    ? Object.entries(project.context_diagnostic)
        .sort(([key, _]) => Number(key))
        // Only keep the "disagree" responses
        .filter(([_, value]) => value === '3')
        .map(([key, value]) => [Number(key), value])
    : null;
  const groupedRecommendations = disagreedItems
    ?.map(([key, _]) => [
      key,
      CONTEXT_DIAGNOSTIC_ITEMS[key].title,
      CONTEXT_DIAGNOSTIC_ITEMS[key].recommendations,
    ])
    .reduce((agg: Record<string, Array<any>>, cur) => {
      const [_, title, recommendations] = cur;
      if (!agg[title]) {
        agg[title] = [];
      }
      agg[title].push(recommendations);
      return agg;
    }, {});
  const recommendationGroup = (title: string) => (
    <div key={title} className="space-y-2">
      <h3 className="text-md print:text-sm font-semibold">{title}</h3>
      {groupedRecommendations &&
        groupedRecommendations[title].map((recommendation) =>
          recommendation.map((rec: string) => (
            <div
              className="flex flex-row items-center space-between p-4 bg-secondary rounded-lg text-left space-x-2"
              key={rec}
            >
              <LightbulbIcon className="shrink-0 ml-2 mr-4" />
              <div className="flex flex-col">
                <p className="text-sm">{rec}</p>
              </div>
            </div>
          )),
        )}
    </div>
  );

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

          {/* two column grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {project?.details?.potentialAdopters && (
              <p className="text-sm">
                Your potential pool of adopters is{' '}
                <b className="font-semibold">
                  {project.details.potentialAdopters}{' '}
                  {formatAdoptionUnit(project, true)}
                </b>
                .
              </p>
            )}
            {potentialAdoptersPlot &&
            project?.details?.engagementType != 'individual' ? (
              // height and width props are required but if they're smaller than
              // the unknown image size, it will load pixelated; so using a huge #
              <span className="text-xs text-muted-foreground">
                <Image
                  src={potentialAdoptersPlot || ''}
                  alt="Potential adopters plot"
                  className="rounded-lg w-full"
                  width={99999}
                  height={99999}
                />
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h2 className="text-muted-foreground inline">
                      Eligible Settlements{' '}
                    </h2>
                    <span className="font-semibold text-right">
                      <div className="rounded-xl h-3 w-3 bg-[#dd3487] inline-block mx-1" />
                      {project?.details?.potentialAdopters}{' '}
                    </span>
                  </div>
                  <div>
                    Created{' '}
                    {project?.last_updated?.identifyPotential != null &&
                      format(project.last_updated.identifyPotential, 'PPPp')}
                  </div>
                </div>
              </span>
            ) : (
              aoiPlot && (
                <div className="text-xs text-muted-foreground">
                  <Image
                    src={aoiPlot || ''}
                    alt="Area of Interest Plot"
                    className="rounded-lg w-full"
                    width={99999}
                    height={99999}
                  />
                  <div className="flex flex-row items-center justify-end">
                    Created{' '}
                    {project?.last_updated?.identifyPotential != null &&
                      format(project.last_updated.identifyPotential, 'PPPp')}
                  </div>
                </div>
              )
            )}

            <div className="">
              {project?.details?.targetAdoption && (
                <p className="text-sm">
                  You stated your goal was to reach{' '}
                  <b className="font-semibold">
                    {project.details.targetAdoption}
                  </b>
                  {project.details.potentialAdopters ? (
                    <>
                      <b className="font-semibold">{` (${asPercentage(
                        project.details.targetAdoption,
                        project.details.potentialAdopters,
                      )})`}</b>{' '}
                      of your pool of potential{' '}
                      <b className="font-semibold">{`${formatAdoptionUnit(project, true)}.`}</b>
                    </>
                  ) : null}
                </p>
              )}
              {project?.details?.growth?.lastReportedAdoption && (
                <p className="text-sm">
                  Currently you have reached{' '}
                  <b className="font-semibold">
                    {project.details.growth.lastReportedAdoption}
                  </b>
                  {project.details.potentialAdopters ? (
                    <>
                      <b className="font-semibold">{` (${asPercentage(
                        project.details.growth.lastReportedAdoption,
                        project.details.potentialAdopters,
                      )})`}</b>{' '}
                      of your potential pool of{' '}
                      {`${formatAdoptionUnit(project, true)}`}
                    </>
                  ) : null}
                  .
                </p>
              )}
              {project?.details?.growth?.probabilityOfSuccess != null &&
              project.details.targetAdoption ? (
                <p className="text-sm">
                  Given current trends, we project that you have{' '}
                  <b className="font-semibold">
                    {project.details.growth.probabilityOfSuccess.toFixed(2)}%
                  </b>{' '}
                  probability that you will reach or exceed your target of{' '}
                  <b className="font-semibold">
                    {project.details.targetAdoption}
                  </b>
                  {project.details.endingDate
                    ? ` by ${format(project.details.endingDate, 'MMMM dd, yyyy')}`
                    : '.'}
                  .
                </p>
              ) : null}
            </div>
            {forecastPlot && (
              <div className="text-xs text-muted-foreground space-y-1">
                <Image
                  src={forecastPlot || ''}
                  alt="Forecast Plot"
                  width={99999}
                  height={99999}
                  className="rounded-lg"
                />
                <div className="flex flex-row items-center justify-end">
                  Created{' '}
                  {project?.last_updated?.assessProgress != null &&
                    format(project.last_updated.assessProgress, 'PPPp')}
                </div>
              </div>
            )}
          </div>

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
                <div className="hidden lg:grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    {groupedRecommendations &&
                      Object.keys(groupedRecommendations)
                        .slice(
                          0,
                          Object.keys(groupedRecommendations).length / 2,
                        )
                        .map((title) => recommendationGroup(title))}
                  </div>
                  <div className="flex flex-col gap-4">
                    {groupedRecommendations &&
                      Object.keys(groupedRecommendations)
                        .slice(
                          Object.keys(groupedRecommendations).length / 2,
                          Object.keys(groupedRecommendations).length,
                        )
                        .map((title) => recommendationGroup(title))}
                  </div>
                </div>
                <div className="flex flex-col lg:hidden gap-4">
                  {groupedRecommendations &&
                    Object.keys(groupedRecommendations).map((title) =>
                      recommendationGroup(title),
                    )}
                </div>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <p>Complete the context diagnostic to receive suggestions.</p>
                <Link
                  href={`/dashboard/project/${slug}/context-diagnostic`}
                  className="print:hidden"
                >
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
