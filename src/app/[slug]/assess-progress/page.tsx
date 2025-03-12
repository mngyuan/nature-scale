import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Info} from 'lucide-react';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Assess Progress</h2>
      <div className="flex flex-row px-8 pb-8 space-x-6">
        <div className="flex flex-col grow space-y-4">
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
            <Input placeholder="118" />
          </div>
          <div className="flex flex-col space-y-2">
            <Label>Target adoption</Label>
            <Input placeholder="92" />
          </div>
          <div className="flex flex-col space-y-2">
            <Input type="file" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            <a>Download the standard reporting form here</a>
          </p>
        </div>
        <div className="flex flex-col grow">
          <h2 className="text-sm text-muted-foreground">Visualisation</h2>
          <p className="font-semibold text-sm">
            Scaling ecosystem-based rangeland management in South Africa
          </p>
          <img
            src="http://127.0.0.1:8000/plot"
            width={400}
            height={400}
            alt="Plot"
          />
        </div>
      </div>
    </main>
  );
}
