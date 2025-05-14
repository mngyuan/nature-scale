'use client';

import {format} from 'date-fns';
import {Check, ChevronDown, Plus, CalendarIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {cn} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import Link from 'next/link';
import {RESOURCE_LABELS} from '@/lib/constants';

const CreateProjectFormSchema = z.object({
  projectName: z.string().min(1, {message: 'Project name is required'}),
  projectDescription: z.string().max(200, {message: 'Max 200 characters'}),
  projectPhoto: z.string(),
  resourcesType: z
    .array(z.string())
    .min(1, {message: 'At least 1 resource type is required'}),
  engagementType: z
    .string()
    .min(1, {message: 'At least 1 engagement type is required'}),
  monitoringFrequency: z.string(),
  startingDate: z.string(),
  endingDate: z.string(),
});

export default function CreateProjectForm() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
      projectPhoto: '',
      resourcesType: [],
      engagementType: '',
      monitoringFrequency: '',
      startingDate: '',
      endingDate: '',
    },
  });

  async function onSubmit(data: z.infer<typeof CreateProjectFormSchema>) {
    console.log(data);
    setLoading(true);

    const {error} = await supabase.from('projects').insert([
      {
        name: data.projectName,
        description: data.projectDescription,
        // country: // should be ISO 2 letter to work nicely with js Intl
        // photo:
        details: {
          resourcesType: data.resourcesType,
          engagementType: data.engagementType,
          monitoringFrequency: data.monitoringFrequency,
          startingDate: data.startingDate,
          endingDate: data.endingDate,
        },
      },
    ]);

    if (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    } else {
      // TODO: show a success toast?
      router.push('/');
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col grow px-8 pb-8 space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="projectName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <Input placeholder="Name of the project" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDescription"
          render={({field}) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <Textarea
                placeholder="Add a description to your project"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectPhoto"
          render={({field}) => (
            <FormItem>
              <FormLabel htmlFor="project-photo">Project Photo</FormLabel>
              <Input type="file" id="project-photo" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="mt-4 mb-6" />
        <FormField
          control={form.control}
          name="resourcesType"
          render={({field}) => (
            <FormItem>
              <FormLabel>Resource(s) Type</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-between h-auto',
                      !field.value.length && 'text-muted-foreground',
                    )}
                  >
                    <div className="flex flex-wrap gap-2">
                      {field.value.length > 0
                        ? field.value.map((item) => (
                            <div
                              key={item}
                              className="bg-black text-white rounded-md px-2 py-1 text-xs flex items-center"
                            >
                              {RESOURCE_LABELS[item] || item}
                            </div>
                          ))
                        : 'Select resource types'}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search resource type..." />
                    <CommandEmpty>No resource type found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {Object.entries(RESOURCE_LABELS).map(([value, label]) => (
                        <CommandItem
                          key={value}
                          onSelect={() => {
                            const newValue = field.value.includes(value)
                              ? field.value.filter((item) => item !== value)
                              : [...field.value, value];
                            field.onChange(newValue);
                          }}
                        >
                          <div
                            className={cn(
                              'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                              field.value.includes(value)
                                ? 'bg-primary text-primary-foreground'
                                : 'opacity-50',
                            )}
                          >
                            {field.value.includes(value) && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          {label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="engagementType"
          render={({field}) => (
            <FormItem>
              <FormLabel>Engagement Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select one engagement type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="settlement">
                    Settlement (Group of houses)
                  </SelectItem>
                  <SelectItem value="village">Village</SelectItem>
                  <SelectItem value="municipality">Municipality</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monitoringFrequency"
          render={({field}) => (
            <FormItem>
              <FormLabel>Monitoring Frequency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Every 2 months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Every day</SelectItem>
                  <SelectItem value="weekly">Every week</SelectItem>
                  <SelectItem value="bi-weekly">Every 2 weeks</SelectItem>
                  <SelectItem value="monthly">Every month</SelectItem>
                  <SelectItem value="bi-monthly">Every 2 months</SelectItem>
                  <SelectItem value="quarterly">Every quarter</SelectItem>
                  <SelectItem value="semi-annually">Every half year</SelectItem>
                  <SelectItem value="annually">Every year</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row w-full space-x-4">
          <FormField
            control={form.control}
            name="startingDate"
            render={({field}) => (
              <FormItem className="grow">
                <FormLabel>Starting Date</FormLabel>
                <div className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? '')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endingDate"
            render={({field}) => (
              <FormItem className="grow">
                <FormLabel>Ending Date</FormLabel>
                <div className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Select date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() ?? '')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="text-xs hover:underline text-muted-foreground">
          {form.watch('monitoringFrequency') &&
            form.watch('engagementType') &&
            form.watch('startingDate') &&
            form.watch('endingDate') && (
              <Link
                href={`/api/standard-reporting-form?${new URLSearchParams({
                  adopterType: form.watch('engagementType'),
                  period: form.watch('monitoringFrequency'),
                  // format as YYYY-MM-DD
                  start: format(
                    new Date(form.watch('startingDate')),
                    'yyyy-MM-dd',
                  ),
                  end: format(new Date(form.watch('endingDate')), 'yyyy-MM-dd'),
                })}`}
                download
              >
                Download a {form.watch('monitoringFrequency')} standard
                reporting form for your project here
              </Link>
            )}
        </div>
        <Button className="mt-4" type="submit">
          <Plus />
          Create Project
        </Button>
      </form>
    </Form>
  );
}
