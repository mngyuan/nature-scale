'use client';

import {useState} from 'react';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Button} from '@/components/ui/button';
import {CONTEXT_DIAGNOSTIC_ITEMS} from '@/lib/constants';
import {createClient} from '@/lib/supabase/client';
import {Tables} from '@/lib/supabase/types/supabase';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

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
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <RadioGroup
        value={itemValue}
        onValueChange={(value) => onChange(itemKey, value)}
        className="flex flex-row"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${itemKey}-1`} />
          <Label htmlFor={`${itemKey}-1`}>Agree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id={`${itemKey}-2`} />
          <Label htmlFor={`${itemKey}-2`}>Neither agree nor disagree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" id={`${itemKey}-3`} />
          <Label htmlFor={`${itemKey}-3`}>Disagree</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="4" id={`${itemKey}-4`} />
          <Label htmlFor={`${itemKey}-4`}>Not applicable</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default function ContextDiagnosticForm({
  project,
}: {
  project: Tables<'projects'> | undefined;
}) {
  const supabase = createClient();
  const [formValues, setFormValues] = useState<Record<string, string>>({});

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
      <div className="flex flex-col grow px-8 pb-8 space-y-4 w-full">
        {CONTEXT_DIAGNOSTIC_ITEMS &&
          Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
            .filter(([key]) => [1, 2, 3, 7, 8, 9, 10].includes(Number(key)))
            .map(([key, item]) => (
              <DiagnosticItem
                key={key}
                itemKey={key}
                itemValue={formValues[key] || ''}
                title={item.title}
                description={item.description}
                onChange={handleValueChange}
              />
            ))}
        {CONTEXT_DIAGNOSTIC_ITEMS &&
          Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
            .filter(([key]) =>
              [6, 11, 12, 13, 15, 16, 17, 18, 19].includes(Number(key)),
            )
            .map(([key, item]) => (
              <DiagnosticItem
                key={key}
                itemKey={key}
                itemValue={formValues[key] || ''}
                title={item.title}
                description={item.description}
                onChange={handleValueChange}
              />
            ))}
        {CONTEXT_DIAGNOSTIC_ITEMS &&
          Object.entries(CONTEXT_DIAGNOSTIC_ITEMS)
            .filter(([key]) => [4, 5, 14].includes(Number(key)))
            .map(([key, item]) => (
              <DiagnosticItem
                key={key}
                itemKey={key}
                itemValue={formValues[key] || ''}
                title={item.title}
                description={item.description}
                onChange={handleValueChange}
              />
            ))}
        <div>
          <Button role="submit" className="mt-4 mr-4" disabled>
            Submit
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <p className="text-sm text-muted-foreground text-center">
                Coming soon!
              </p>
            </TooltipTrigger>
            <TooltipContent>
              Thanks for trying the early access version.
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
