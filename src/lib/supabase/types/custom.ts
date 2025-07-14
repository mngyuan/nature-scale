import {EngagementType} from '@/components/CreateProjectForm';

type PlotData = {
  filePath: string;
  createdAt: string;
};

export type ProjectDetails = {
  potentialAdopters?: string;
  startingDate?: string;
  endingDate?: string;
  engagementType?: EngagementType;
  // TODO: both of the following could be enums like engagement
  monitoringFrequency?: string;
  resourcesType?: string[];
  growth?: {
    social?: number;
    independent?: number;
    lastReportedAdoption?: number;
  };
  targetAdoption?: string;
  plots?: {
    'area-of-interest'?: PlotData;
    'potential-adopters'?: PlotData;
    forecast?: PlotData;
    'forecast-parameters'?: PlotData;
  };
};

export type PlotType = keyof NonNullable<ProjectDetails['plots']>;
