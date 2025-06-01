import {format} from 'date-fns';
import Link from 'next/link';

export default function StandardReportingFormLink({
  engagementType,
  monitoringFrequency,
  startingDate,
  endingDate,
}: {
  engagementType: string;
  monitoringFrequency: string;
  startingDate: string;
  endingDate: string;
}) {
  return (
    <Link
      href={`/api/standard-reporting-form?${new URLSearchParams({
        adopterType: engagementType,
        period: monitoringFrequency,
        // format as YYYY-MM-DD
        start: format(new Date(startingDate), 'yyyy-MM-dd'),
        end: format(new Date(endingDate), 'yyyy-MM-dd'),
      })}`}
      download
    >
      Download a {monitoringFrequency} standard reporting form for your project
      here
    </Link>
  );
}
