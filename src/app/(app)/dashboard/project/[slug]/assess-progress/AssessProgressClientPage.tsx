'use client';

import {useEffect, useState} from 'react';
import {Calculator, Info, LoaderCircle, LoaderIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {R_API_BASE_URL} from '@/lib/constants';
import {Button} from '@/components/ui/button';
import {useProjects} from '@/components/ProjectContext';
import {Tables} from '@/lib/supabase/types/supabase';
import StandardReportingFormLink from '@/components/StandardReportingFormLink';
import {createClient} from '@/lib/supabase/client';
import {useMeasuredElement} from '@/lib/hooks';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {savePlot} from '../actions';

const MONITORING_TIME_UNITS = {
  daily: 'days',
  weekly: 'weeks',
  'bi-weekly': 'weeks',
  monthly: 'month',
  'bi-monthly': 'months',
  quarterly: 'months',
  'semi-annually': 'years',
  annually: 'years',
};

export default function AssessProgressClientPage({
  project,
}: {
  project?: Tables<'projects'>;
}) {
  const supabase = createClient();
  // Update context store with project data from server
  const {updateProjects} = useProjects();
  useEffect(() => {
    if (project && project.id && updateProjects) {
      updateProjects({[project.id]: project});
    }
  }, [project, updateProjects]);

  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [plotImageLoading, setPlotImageLoading] = useState(false);
  const [paramPlotImage, setParamPlotImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [potentialAdopters, setPotentialAdopters] = useState<string>(
    project?.details?.potentialAdopters || '',
  );
  const [targetAdoption, setTargetAdoption] = useState<string>('');
  const [csvFile, setCSVFile] = useState<File | null>(null);

  const {ref: imageContainerRef, dimensions: imageDimensions} =
    useMeasuredElement();

  const fetchPlot = async () => {
    setError(null);
    setPlotImageLoading(true);
    try {
      const csvContent = await csvFile?.text();
      const response = await fetch(
        // Vercel server function times out in 60s so directly call the R API
        // `/api/forecast-graph?${new URLSearchParams({
        `${R_API_BASE_URL}/run-forecast?${new URLSearchParams({
          potentialAdopters: potentialAdopters,
          targetAdoption,
          iwidth: imageDimensions.width.toString(),
          iheight: imageDimensions.height.toString(),
        })}`,
        {
          method: 'POST',
          body: csvContent,
          headers: {
            'Content-Type': 'application/csv',
          },
        },
      );
      if (!response.ok) {
        throw new Error('Failed to fetch plot');
      }
      const respJSON = await response.json();
      setPlotImage(
        `data:${respJSON.plot.type};base64,${respJSON.plot.base64[0]}`,
      );
      savePlot(project, 'forecast', respJSON.plot.base64[0]);
      setParamPlotImage(
        `data:${respJSON.parameters.plot.type};base64,${respJSON.parameters.plot.base64[0]}`,
      );
      savePlot(
        project,
        'forecast-parameters',
        respJSON.parameters.plot.base64[0],
      );
      if (project) {
        const {error} = await supabase
          .from('projects')
          .update({
            details: {
              ...project.details,
              ...(targetAdoption && {targetAdoption}),
              growth: {
                independent: respJSON.parameters.independent[0],
                social: respJSON.parameters.social[0],
                // TODO: get last non-NA value for lastReportedAdoption
                // (in R or here)
              },
            },
          })
          .eq('id', project?.id);
        if (error) throw error;
      }
    } catch (err) {
      setError('Failed to load plot. Please try again later.');
      console.error(err);
    } finally {
      setPlotImageLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-center space-x-1">
          <p className="font-semibold text-sm">
            Enter data to assess if your project is on track
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Using our statistical model, analyze your past data to forecast future
          adoption trends and compare with your project's target
        </p>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row gap-1">
            <Label>Adopter population estimate</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent>
                Total number of possible adopters within the project area.
                Calculated in the previous module
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            type="number"
            placeholder="An educated guess at the total number of potential adopters"
            value={potentialAdopters}
            onChange={(e) => setPotentialAdopters(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Target adoption</Label>
          <Input
            type="number"
            placeholder="The number of adopters you hope have at the end of the project"
            value={targetAdoption}
            onChange={(e) => setTargetAdoption(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Standard Reporting Form</Label>
          <Input
            type="file"
            accept=".csv"
            multiple={false}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCSVFile(file);
              }
            }}
          />
        </div>
        {project?.details?.startingDate &&
          project?.details?.endingDate &&
          project?.details?.engagementType &&
          project?.details?.monitoringFrequency && (
            <p className="text-xs text-muted-foreground">
              <StandardReportingFormLink
                engagementType={project.details.engagementType}
                monitoringFrequency={project.details.monitoringFrequency}
                startingDate={project.details.startingDate}
                endingDate={project.details.endingDate}
              />
            </p>
          )}
        <div className="text-right">
          <Button
            role="submit"
            disabled={!(csvFile && potentialAdopters) || plotImageLoading}
            className="w-full lg:w-auto shrink"
            onClick={() => fetchPlot()}
          >
            {plotImageLoading ? (
              <>
                <LoaderCircle className="w-2 h-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator />
                Calculate
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col grow gap-2">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <h2 className="text-sm text-muted-foreground">Visualisation</h2>
        <p className="font-semibold text-sm">{project?.description}</p>
        <Tabs defaultValue="forecast" className="h-full w-full">
          <TabsList className="mb-2">
            <TabsTrigger
              value="forecast"
              className="grow"
              disabled={plotImage == null}
            >
              Forecast
            </TabsTrigger>
            <TabsTrigger
              value="parameters"
              className="grow"
              disabled={paramPlotImage == null}
            >
              Adoption parameters
            </TabsTrigger>
          </TabsList>
          <TabsContent value="forecast" className="h-full w-full">
            <div
              className="flex items-center justify-center h-full min-w-full min-h-64 lg:min-w-auto lg:min-h-auto"
              ref={imageContainerRef}
            >
              {plotImageLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : plotImage ? (
                <img
                  src={plotImage}
                  className="object-contain h-full"
                  alt="Plot"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Complete the form to see an adoption forecast
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="parameters">
            <div className="flex items-center justify-center h-full min-w-full min-h-64 lg:min-w-auto lg:min-h-auto">
              {plotImageLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : paramPlotImage ? (
                <img
                  src={paramPlotImage}
                  className="object-contain h-full"
                  alt="Adoption parameters plot"
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Complete the form to see adoption parameters
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
