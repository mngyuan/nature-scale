import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {getProject} from '../actions';
import {ChartNoAxesCombinedIcon, Info, Sun} from 'lucide-react';

export default async function ScalingSuggestionsPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const project = await getProject(slug);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Suggestions to improve scale</h2>
      <div className="grid grid-cols-2 gap-4 px-8 pb-8 space-x-6">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-1">
              <Sun size={16} className="" />
              <p className="font-semibold text-lg">Insights</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-row items-center space-x-1">
              <ChartNoAxesCombinedIcon size={16} className="" />
              <p className="font-semibold text-lg">Suggestions</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on the project stage, your data, and your responses, the
              following suggestions may help improve the adoption rate.
            </p>
          </div>
        </div>
        <div className="flex flex-col"></div>
      </div>
    </main>
  );
}
