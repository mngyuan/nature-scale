'use client';

import {useEffect, useState} from 'react';
import {Info, LoaderIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

export default function AssessProgressPage() {
  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [plotImageLoading, setPlotImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adopterPopulation, setAdopterPopulation] = useState<string | null>(
    null,
  );
  const [totalWeeks, setTotalWeeks] = useState<string | null>(null);
  const [csvFile, setCSVFile] = useState<File | null>(null);

  // Fetch plot image
  useEffect(() => {
    const fetchPlot = async () => {
      setError(null);
      setPlotImageLoading(true);
      try {
        const csvContent = await csvFile?.text();
        const response = await fetch(
          `/api/forecast-graph?${new URLSearchParams({
            potentialAdopters: adopterPopulation!,
            totalWeeks: totalWeeks!,
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
    if (csvFile && adopterPopulation && totalWeeks) {
      fetchPlot();
    }
  }, [csvFile, adopterPopulation, totalWeeks]);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Assess Progress</h2>
      <div className="grid grid-cols-2 gap-4 px-8 pb-8 space-x-6">
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
              placeholder="118"
              value={adopterPopulation || ''}
              onChange={(e) => setAdopterPopulation(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Target adoption</Label>
            <Input placeholder="92" />
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Time (weeks)</Label>
            <Input
              placeholder={
                // TODO: populate default from the project data
                '52'
              }
              value={totalWeeks || ''}
              onChange={(e) => setTotalWeeks(e.target.value)}
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
          <p className="text-xs text-muted-foreground text-center">
            <a>Download the standard reporting form here</a>
          </p>
        </div>
        <div className="flex flex-col grow">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <h2 className="text-sm text-muted-foreground">Visualisation</h2>
          <p className="font-semibold text-sm">
            Scaling ecosystem-based rangeland management in South Africa
          </p>
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
      </div>
    </main>
  );
}
