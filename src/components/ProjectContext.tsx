'use client';

import {Tables} from '@/lib/supabase/types/supabase';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';

type ProjectContextType = {
  projects: Record<string, Tables<'projects'>>;
  updateProjects: (projects: Record<string, Tables<'projects'>>) => void;
};

// Initialize with empty record and no-op function
const ProjectContext = createContext<ProjectContextType>({
  projects: {},
  updateProjects: () => {},
});

export const ProjectProvider = ({children}: {children: ReactNode}) => {
  const [projects, setProjects] = useState<Record<string, Tables<'projects'>>>(
    {},
  );

  const updateProjects = useCallback(
    (newProjects: Record<string, Tables<'projects'>>) =>
      setProjects((prev) => ({...prev, ...newProjects})),
    [],
  );

  return (
    <ProjectContext.Provider value={{projects, updateProjects}}>
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjects() {
  const {projects, updateProjects} = useContext(ProjectContext);
  return {projects, updateProjects};
}

/**
 * Provides the same functionality as the hook but for server components
 * which can't use hooks
 */
export function ProjectDataForwarder({
  project,
}: {
  project?: Tables<'projects'>;
}) {
  const context = useContext(ProjectContext);

  useEffect(() => {
    if (project && project.id && context.updateProjects) {
      context.updateProjects({[project.id]: project});
    }
  }, [project, context.updateProjects]);

  return null;
}
