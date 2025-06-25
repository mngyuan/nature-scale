'use client';

import {useState} from 'react';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Button} from '@/components/ui/button';
import {CONTEXT_DIAGNOSTIC_ITEMS} from '@/lib/constants';
import {createClient} from '@/lib/supabase/client';
import {Tables} from '@/lib/supabase/types/supabase';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {cn} from '@/lib/utils';

const DiagnosticItem = ({
  itemKey,
  itemValue,
  description,
  onChange,
}: {
  title?: string;
  itemKey: string;
  itemValue: string;
  description?: string;
  onChange: (key: string, value: string) => void;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {description && <p className="text-sm font-medium">{description}</p>}
      <RadioGroup
        value={itemValue}
        onValueChange={(value) => onChange(itemKey, value)}
        className="flex flex-row"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${itemKey}-1`} />
          <Label
            htmlFor={`${itemKey}-1`}
            className={cn(
              'font-normal text-muted-foreground',
              itemValue === '1' ? 'text-primary' : undefined,
            )}
          >
            Agree
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id={`${itemKey}-2`} />
          <Label
            htmlFor={`${itemKey}-2`}
            className={cn(
              'font-normal text-muted-foreground',
              itemValue === '2' ? 'text-primary' : undefined,
            )}
          >
            Neither agree nor disagree
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" id={`${itemKey}-3`} />
          <Label
            htmlFor={`${itemKey}-3`}
            className={cn(
              'font-normal text-muted-foreground',
              itemValue === '3' ? 'text-primary' : undefined,
            )}
          >
            Disagree
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4" id={`${itemKey}-4`} />
          <Label
            htmlFor={`${itemKey}-4`}
            className={cn(
              'font-normal text-muted-foreground',
              itemValue === '4' ? 'text-primary' : undefined,
            )}
          >
            Not applicable
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

function isStringRecord(obj: unknown): obj is Record<string, string> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    Object.entries(obj).every(
      ([key, value]) => typeof key === 'string' && typeof value === 'string',
    )
  );
}

export default function ContextDiagnosticForm({
  project,
}: {
  project: Tables<'projects'> | undefined;
}) {
  const supabase = createClient();
  const [formValues, setFormValues] = useState<Record<string, string>>(
    isStringRecord(project?.context_diagnostic)
      ? project.context_diagnostic
      : {},
  );

  const handleValueChange = (key: string, value: string) =>
    setFormValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));

  const onSubmit = async () => {
    if (!project?.id) {
      console.error('Project ID is not available');
      return;
    }

    const {error} = await supabase
      .from('projects')
      .update({
        context_diagnostic: formValues,
      })
      .eq('id', project?.id);
    if (error) throw error;
  };

  return (
    <>
      <form className="flex flex-col grow px-8 pb-8 w-full" onSubmit={onSubmit}>
        <ul className="space-y-4">
          {CONTEXT_DIAGNOSTIC_ITEMS &&
            Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
              .filter(([key]) => [1, 2, 3, 7, 8, 9, 10].includes(Number(key)))
              .map(([key, item]) => (
                <li key={key}>
                  <DiagnosticItem
                    key={key}
                    itemKey={key}
                    itemValue={formValues[key] || ''}
                    title={item.title}
                    description={item.description}
                    onChange={handleValueChange}
                  />
                </li>
              ))}
          {CONTEXT_DIAGNOSTIC_ITEMS &&
            Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
              .filter(([key]) =>
                [6, 11, 12, 13, 15, 16, 17, 18, 19].includes(Number(key)),
              )
              .map(([key, item]) => (
                <li key={key}>
                  <DiagnosticItem
                    key={key}
                    itemKey={key}
                    itemValue={formValues[key] || ''}
                    title={item.title}
                    description={item.description}
                    onChange={handleValueChange}
                  />
                </li>
              ))}
          {CONTEXT_DIAGNOSTIC_ITEMS &&
            Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
              .filter(([key]) => [4, 5, 14].includes(Number(key)))
              .map(([key, item]) => (
                <li key={key}>
                  <DiagnosticItem
                    key={key}
                    itemKey={key}
                    itemValue={formValues[key] || ''}
                    title={item.title}
                    description={item.description}
                    onChange={handleValueChange}
                  />
                </li>
              ))}
        </ul>
        <div>
          <Button
            role="submit"
            className="mt-4 mr-4"
            disabled={Object.keys(formValues).length < 1}
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
