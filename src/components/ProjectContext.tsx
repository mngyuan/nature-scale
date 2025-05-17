'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';

// TODO: supabase typescript type generation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Project = any;
type ProjectContextType = {
  projects?: Record<string, Project>;
  updateProjects?: (projects: Record<string, Project>) => void;
};

const ProjectContext = createContext<ProjectContextType>({});

export const ProjectProvider = ({children}: {children: ReactNode}) => {
  const [projects, setProjects] = useState<ProjectContextType>({});

  const updateProjects = useCallback(
    (newProjects: Record<string, Project>) =>
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
export function ProjectDataForwarder({project}: {project?: Project}) {
  const context = useContext(ProjectContext);

  useEffect(() => {
    if (project && project.id && context.updateProjects) {
      context.updateProjects({[project.id]: project});
    }
  }, [project, context.updateProjects]);

  return null;
}
