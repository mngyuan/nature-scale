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

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') {
    return;
  }

  const crumbs = pathname.split('/').filter(Boolean);

  return (
    <nav className="w-full flex flex-row p-4 justify-between border-b border-gray-200 capitalize">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.slice(0, -1).map((crumb, index) => (
            <React.Fragment key={crumb}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/${crumbs.slice(0, index + 1).join('/')}`}
                >
                  {formatPathCrumb(crumb)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbPage>
            {formatPathCrumb(crumbs[crumbs.length - 1])}
          </BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
}
