'use client';

import {useEffect, useState} from 'react';
import {Calculator, Info, LoaderIcon} from 'lucide-react';
import Link from 'next/link';
import {format} from 'date-fns';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {R_API_BASE_URL} from '@/lib/constants';
import {Button} from '@/components/ui/button';
import {useProjects} from '@/components/ProjectContext';

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
  // TODO: supabase typescript type generation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: any;
}) {
  // Update context store with project data from server
  const {updateProjects} = useProjects();
  useEffect(() => {
    if (project && project.id && updateProjects) {
      updateProjects({[project.id]: project});
    }
  }, [project, updateProjects]);

  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [plotImageLoading, setPlotImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adopterPopulation, setAdopterPopulation] = useState<string>('');
  const [targetAdoption, setTargetAdoption] = useState<string>('');
  const [csvFile, setCSVFile] = useState<File | null>(null);

  const fetchPlot = async () => {
    setError(null);
    setPlotImageLoading(true);
    try {
      const csvContent = await csvFile?.text();
      const response = await fetch(
        // Vercel server function times out in 60s so directly call the R API
        // `/api/forecast-graph?${new URLSearchParams({
        `${R_API_BASE_URL}/run-forecast?${new URLSearchParams({
          potentialAdopters: adopterPopulation,
          targetAdoption,
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
      const objURL = URL.createObjectURL(await response.blob());
      setPlotImage(objURL);
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
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} />
            </TooltipTrigger>
            <TooltipContent>Assess Progress</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Adopter population estimate</Label>
          <Input
            type="number"
            placeholder="An educated guess at the number of potential adopters"
            value={adopterPopulation}
            onChange={(e) => setAdopterPopulation(e.target.value)}
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
        {project?.details?.startingDate && project?.details?.endingDate && (
          <p className="text-xs text-muted-foreground">
            <Link
              href={`/api/standard-reporting-form?${new URLSearchParams({
                adopterType: project.details.engagementType,
                period: project.details.monitoringFrequency,
                // format as YYYY-MM-DD
                start: format(
                  new Date(project.details.startingDate),
                  'yyyy-MM-dd',
                ),
                end: format(new Date(project.details.endingDate), 'yyyy-MM-dd'),
              })}`}
              download
            >
              Download a {project.details.monitoringFrequency} standard
              reporting form for your project here
            </Link>
          </p>
        )}
        <div className="text-right">
          <Button
            role="submit"
            disabled={!(csvFile && adopterPopulation)}
            className="shrink"
            onClick={() => fetchPlot()}
          >
            <Calculator />
            Calculate
          </Button>
        </div>
      </div>
      <div className="flex flex-col grow">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <h2 className="text-sm text-muted-foreground">Visualisation</h2>
        <p className="font-semibold text-sm">{project.description}</p>
        <div className="w-[480px] h-[480px] flex items-center justify-center">
          {plotImageLoading ? (
            <LoaderIcon className="animate-spin" />
          ) : plotImage ? (
            <img src={plotImage} width={480} height={480} alt="Plot" />
          ) : (
            <div className="text-sm text-muted-foreground">
              Complete the form to see an adoption forecast
            </div>
          )}
        </div>
      </div>
    </>
  );
}
