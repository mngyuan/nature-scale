import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Info} from 'lucide-react';
import JurisdictionalBoundaryForm from '@/components/JurisdictionalBoundaryForm';
import {API_BASE_URL} from '@/lib/constants';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Identify scaling potential and targets</h2>
      <div className="flex flex-row px-8 pb-8 space-x-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row items-center space-x-1">
            <p className="font-semibold text-sm">Project boundary</p>
            <Tooltip>
              <TooltipTrigger>
                <Info size={16} />
              </TooltipTrigger>
              <TooltipContent>Assess Progress</TooltipContent>
            </Tooltip>
          </div>
          <Tabs defaultValue="jurisdictional">
            <TabsList className="grid w-full grid-cols-2 h-full mb-2">
              <TabsTrigger
                value="jurisdictional"
                className="flex flex-col items-start p-4 text-wrap whitespace-normal text-left"
              >
                <p className="">Jurisdictional</p>
                <p className="font-normal">
                  Enter your project's legally-defined operational area
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex flex-col items-start p-4 text-wrap whitespace-normal text-left"
              >
                <p className="">Custom</p>
                <p className="font-normal">
                  Upload the custom boundaries of your project
                </p>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jurisdictional">
              <JurisdictionalBoundaryForm />
            </TabsContent>
            <TabsContent value="custom">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="custom-boundary">Custom boundary</Label>
                <Input id="custom-boundary" type="file" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col grow">
          <h2 className="text-sm text-muted-foreground">Location</h2>
          <p className="font-semibold text-sm">South Africa</p>
          <img
            src={`${API_BASE_URL}/plot`}
            width={400}
            height={400}
            alt="Plot"
          />
        </div>
      </div>
    </main>
  );
}
