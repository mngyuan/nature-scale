'use client';

import {useEffect, useState} from 'react';
import {wakeRAPI} from '@/app/actions';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {LoaderCircle} from 'lucide-react';

type APIResponseType = Awaited<ReturnType<typeof wakeRAPI>>;

export default function APIStatusIndicator() {
  const [apiResponse, setAPIResponse] = useState<APIResponseType>({
    apiStatus: 'loading',
    apiStatusReason: '',
  });

  const {apiStatus, apiStatusReason, httpCode, httpBody} = apiResponse;

  useEffect(() => {
    const fetchAPIStatus = async () => {
      const response = await wakeRAPI();
      setAPIResponse({...response});
    };

    fetchAPIStatus();
  }, []);

  return (
    <div className="flex flex-row text-xs text-muted-foreground space-x-1 items-center">
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
      <div>API Status: {apiStatus}</div>
    </div>
  );
}
