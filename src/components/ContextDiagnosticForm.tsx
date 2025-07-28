'use client';

import {useState} from 'react';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Button} from '@/components/ui/button';
import {CONTEXT_DIAGNOSTIC_ITEMS} from '@/lib/constants';
import {createClient} from '@/lib/supabase/client';
import {Tables} from '@/lib/supabase/types/supabase';
import {cn} from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import {ArrowRight, Calculator, NotebookPen} from 'lucide-react';
import {updateLastUpdated} from '@/app/(app)/dashboard/project/[slug]/actions';

const DiagnosticItem = ({
  itemKey,
  itemValue,
  onChange,
  title,
}: {
  title?: string;
  itemKey: string;
  itemValue: string;
  onChange: (key: string, value: string) => void;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {title && <p className="text-sm font-medium">{title}</p>}
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
  const [dialogOpen, setDialogOpen] = useState(false);

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

    updateLastUpdated(project, 'contextDiagnostic');
    setDialogOpen(true);
  };

  return (
    <>
      <form className="flex flex-col grow px-8 pb-8 w-full space-y-4">
        <ul className="space-y-8">
          {CONTEXT_DIAGNOSTIC_ITEMS &&
            Object.entries(CONTEXT_DIAGNOSTIC_ITEMS).map(([key, item]) => (
              <li key={key}>
                <DiagnosticItem
                  key={key}
                  itemKey={key}
                  itemValue={formValues[key] || ''}
                  title={item.title}
                  onChange={handleValueChange}
                />
              </li>
            ))}
        </ul>
        <div>
          <Button
            type="button"
            className="mt-4 mr-4"
            disabled={Object.keys(formValues).length < 1}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </form>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggestions ready</DialogTitle>
            <DialogDescription>
              Your answers have been saved. You can now view suggestions for
              scaling your project based on the context diagnostic you provided.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center justify-between gap-2">
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="grow"
            >
              <NotebookPen />
              Change answers
            </Button>
            <Link href={`/dashboard/project/${project?.id}`} className="grow">
              <Button onClick={() => setDialogOpen(false)} className="w-full">
                <ArrowRight />
                Done
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
