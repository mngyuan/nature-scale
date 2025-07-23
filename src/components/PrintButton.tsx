'use client';

import {Button} from '@/components/ui/button';
import {Printer} from 'lucide-react';

export default function PrintButton() {
  return (
    <Button
      className="mb-4 grow-0 w-full lg:w-auto shrink print:hidden"
      onClick={() => window.print()}
    >
      <Printer />
      Print this page for your records
    </Button>
  );
}
