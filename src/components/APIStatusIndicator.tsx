'use client';

import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {useAPIStatus} from '@/lib/hooks';
import {LoaderCircle} from 'lucide-react';

export default function APIStatusIndicator({
  hidden = false,
}: {
  hidden?: boolean;
}) {
  const {apiStatus, apiStatusReason, httpCode, httpBody, fetchAPIStatus} =
    useAPIStatus();

  return (
    <div
      className={`flex flex-row text-xs text-muted-foreground space-x-1 items-center ${hidden ? 'hidden' : ''}`}
    >
      <Tooltip>
        <TooltipTrigger>
          {apiStatus === 'loading' ? (
            <LoaderCircle className="w-2 h-2 animate-spin" />
          ) : (
            <div
              className={`w-2 h-2 rounded-lg ${apiStatus === 'up' ? 'bg-green-400' : 'bg-red-400'}`}
            />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {JSON.stringify(
            {
              apiStatus,
              apiStatusReason,
              httpCode,
              httpBody,
            },
            null,
            2,
          )}
        </TooltipContent>
      </Tooltip>
      <div className="hover:underline cursor-pointer">
        <a onClick={fetchAPIStatus}>API Status: {apiStatus}</a>
      </div>
    </div>
  );
}
