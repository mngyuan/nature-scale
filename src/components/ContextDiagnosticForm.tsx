'use client';

import {useState} from 'react';
import {Info, UserIcon, UsersIcon} from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

const DIAGNOSTIC_COLORS = [
  'text-red-500',
  'text-amber-500',
  'text-lime-500',
  'text-green-500',
];
const DIAGNOSTIC_DESCRIPTION = [
  'Strongly limits scaling',
  'Somewhat limits scaling',
  'Somewhat supports scaling',
  'Strongly supports scaling',
];
const DiagnosticItem = ({
  title,
  value,
  description,
}: {
  title: string;
  value?: string;
  description?: string;
}) => {
  const idPrefix = title.toLowerCase().replace(/\s+/g, '-');

  const [selectedValue, setSelectedValue] = useState(value || null);
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex flex-row">
            <Label>{title}</Label>
            {description && (
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="mx-2" />
                </TooltipTrigger>
                <TooltipContent>{description}</TooltipContent>
              </Tooltip>
            )}
            <div
              className={
                selectedValue
                  ? DIAGNOSTIC_COLORS[parseInt(selectedValue) - 1]
                  : ''
              }
            >
              {selectedValue
                ? DIAGNOSTIC_DESCRIPTION[parseInt(selectedValue) - 1]
                : ''}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <RadioGroup
            value={selectedValue || ''}
            onValueChange={setSelectedValue}
            className="flex flex-row"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id={`${idPrefix}-1`} />
              <Label htmlFor={`${idPrefix}-1`}>1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id={`${idPrefix}-2`} />
              <Label htmlFor={`${idPrefix}-2`}>2</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id={`${idPrefix}-3`} />
              <Label htmlFor={`${idPrefix}-3`}>3</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id={`${idPrefix}-4`} />
              <Label htmlFor={`${idPrefix}-4`}>4</Label>
            </div>
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default function ContextDiagnosticForm() {
  return (
    <div className="grid grid-cols-3 gap-4 px-8 pb-8 space-x-6">
      <div className="flex flex-col">
        <h2 className="font-semibold text-md">
          <UserIcon className="inline mr-2" size={16} />
          Individual Uptake
        </h2>
        <DiagnosticItem title="Financial Cost" description="test" />
        <DiagnosticItem title="Environmental Benefit" description="test" />
        <DiagnosticItem title="Extension support" description="test" />
        <DiagnosticItem title="Trialability" description="test" />
        <DiagnosticItem title="Compatible with needs" description="test" />
        <DiagnosticItem title="Empowerment" description="test" />
        <DiagnosticItem title="Economic wellbeing" description="test" />
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-md">
          <UserIcon className="inline mr-2" size={16} />
          Individual Uptake and
          <UsersIcon className="inline mx-2" size={16} />
          Social Transmission
        </h2>
        <DiagnosticItem title="Globally supported" description="test" />
        <DiagnosticItem title="Nationally supported" description="test" />
        <DiagnosticItem title="NGOs" description="test" />
        <DiagnosticItem title="Timing of benefits" description="test" />
        <DiagnosticItem title="Reputational benefits" description="test" />
        <DiagnosticItem title="Observable" description="test" />
        <DiagnosticItem title="Proximity" description="test" />
        <DiagnosticItem title="Social connectivity" description="test" />
        <DiagnosticItem title="Local champions" description="test" />
      </div>
      <div className="flex flex-col">
        <h2 className="font-semibold text-md">
          <UsersIcon className="inline mr-2" size={16} />
          Social Transmission
        </h2>
        <DiagnosticItem title="Aligned with practices" description="test" />
        <DiagnosticItem title="Simplicity" description="test" />
        <DiagnosticItem title="Tenure" description="test" />
        <DiagnosticItem title="Adaptability" description="test" />
      </div>
    </div>
  );
}
