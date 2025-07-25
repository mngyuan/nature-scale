import {EngagementType} from '@/components/CreateProjectForm';

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
    probabilityOfSuccess?: number;
  };
  targetAdoption?: string;
  currentAdoption?: number;
};

export type ProjectLastUpdated = {
  identifyPotential?: string;
  assessProgress?: string;
  contextDiagnostic?: string;
};

export type PlotType =
  | 'area-of-interest'
  | 'potential-adopters'
  | 'forecast'
  | 'forecast-parameters';
