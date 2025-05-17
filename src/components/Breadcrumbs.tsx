'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {usePathname} from 'next/navigation';
import {formatPathCrumb} from '@/lib/utils';
import {useProjects} from './ProjectContext';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = pathname.split('/').filter(Boolean);
  const {projects} = useProjects();

  if (pathname === '/') {
    return;
  }

  const displayCrumbs = [...crumbs];
  if (displayCrumbs.indexOf('project') !== -1 && projects) {
    const projectSlugCrumb =
      displayCrumbs[displayCrumbs.indexOf('project') + 1];
    displayCrumbs.splice(
      displayCrumbs.indexOf('project') + 1,
      1,
      projects[projectSlugCrumb]?.name || projectSlugCrumb,
    );
  }

  return (
    <nav className="w-full flex flex-row p-4 justify-between border-b border-gray-200">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((crumb, index) => {
            if (crumb === 'project') {
              return;
            }
            if (index === crumbs.length - 1) {
              return (
                <React.Fragment key={crumb}>
                  <BreadcrumbSeparator />
                  <BreadcrumbPage>
                    {formatPathCrumb(displayCrumbs[index])}
                  </BreadcrumbPage>
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={crumb}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/${crumbs.slice(0, index + 1).join('/')}`}>
                      {formatPathCrumb(displayCrumbs[index])}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
