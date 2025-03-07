import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {ArrowLeft, ArrowRight, Info} from 'lucide-react';

export default async function Page({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Identify scaling potential and targets</h2>
      <div className="flex flex-row px-8 space-x-6">
        <div className="flex flex-col grow space-y-4">
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
            <TabsList className="grid w-full grid-cols-2 h-full">
              <TabsTrigger
                value="jurisdictional"
                className="flex flex-col items-start p-2 text-wrap whitespace-normal text-left"
              >
                <p className="">Jurisdictional</p>
                <p className="font-normal">
                  Enter your project's legally-defined operational area
                </p>
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex flex-col items-start p-2 text-wrap whitespace-normal text-left"
              >
                <p className="">Custom</p>
                <p className="font-normal">
                  Upload the custom boundaries of your project
                </p>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jurisdictional" className="flex flex-col gap-4">
              <div className="flex flex-col space-y-2">
                <Label>Region</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Region 1</SelectItem>
                    <SelectItem value="2">Region 2</SelectItem>
                    <SelectItem value="3">Region 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>District</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">District 1</SelectItem>
                    <SelectItem value="2">District 2</SelectItem>
                    <SelectItem value="3">District 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Ward</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select the ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ward 1</SelectItem>
                    <SelectItem value="2">Ward 2</SelectItem>
                    <SelectItem value="3">Ward 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-right">
                <Button>
                  <ArrowRight />
                  Next
                </Button>
              </div>
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
          <h2 className="text-sm text-gray-500">Location</h2>
          <p className="font-semibold text-sm">South Africa</p>
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
