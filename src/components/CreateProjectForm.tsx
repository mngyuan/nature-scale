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
import {Calendar} from '@/components/Calendar';
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
import {cn, countryNameFromCode} from '@/lib/utils';
import {createClient} from '@/lib/supabase/client';
import {COUNTRY_BY_ISO3166, RESOURCE_TYPES} from '@/lib/constants';
import {User} from '@supabase/supabase-js';
import StandardReportingFormLink from './StandardReportingFormLink';

const ENGAGEMENT_TYPES = {
  individual: 'Individual',
  settlement: 'Settlement (Group of houses)',
  village: 'Village',
  municipality: 'Municipality',
} as const;

export type EngagementType = keyof typeof ENGAGEMENT_TYPES;

const CreateProjectFormSchema = z.object({
  projectName: z.string().min(1, {message: 'Project name is required'}),
  projectDescription: z.string().max(200, {message: 'Max 200 characters'}),
  projectPhoto: z.instanceof(File).optional(),
  countryCode: z.string().min(1, {message: 'Country is required'}).max(2),
  resourcesType: z
    .array(z.enum(Object.keys(RESOURCE_TYPES) as [keyof typeof RESOURCE_TYPES]))
    .min(1, {message: 'At least 1 resource type is required'}),
  engagementType: z.enum(Object.keys(ENGAGEMENT_TYPES) as [EngagementType], {
    message: 'At least 1 engagement type is required',
  }),
  monitoringFrequency: z.string(),
  startingDate: z.string(),
  endingDate: z.string(),
});

export default function CreateProjectForm({user}: {user: User | null}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  // TODO: make a ComboBox component ala shadcn
  const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
      projectPhoto: undefined,
      countryCode: '',
      resourcesType: [],
      engagementType: undefined,
      monitoringFrequency: '',
      startingDate: '',
      endingDate: '',
    },
  });

  async function onSubmit(data: z.infer<typeof CreateProjectFormSchema>) {
    setLoading(true);

    let project_image_url = null;

    if (data.projectPhoto) {
      const file = data.projectPhoto;
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const {error: uploadError} = await supabase.storage
        .from('project-images')
        .upload(filePath, file);

      if (uploadError) {
        // TODO: display to user
        console.error('Error uploading project image:', uploadError);
      }

      project_image_url = filePath;
    }

    const {error} = await supabase.from('projects').insert([
      {
        name: data.projectName,
        description: data.projectDescription,
        country_code: data.countryCode,
        project_image_url: project_image_url,
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
      // TODO: display to user
      // alert('Error creating project');
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
          render={({field: {value, onChange, ...fieldProps}}) => (
            <FormItem>
              <FormLabel htmlFor="project-photo">Project Photo</FormLabel>
              <Input
                type="file"
                id="project-photo"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                  }
                }}
                {...fieldProps}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="mt-4 mb-6" />
        <FormField
          control={form.control}
          name="countryCode"
          render={({field}) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Popover
                open={countryPopoverOpen}
                onOpenChange={setCountryPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn('w-full justify-between h-auto font-normal')}
                  >
                    {field.value ? (
                      <div>{field.value}</div>
                    ) : (
                      <div className="text-muted-foreground">
                        Select a country
                      </div>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {Object.keys(COUNTRY_BY_ISO3166)
                        .map((code) => countryNameFromCode(code))
                        .map((countryName) => (
                          <CommandItem
                            key={countryName}
                            onSelect={(s) => {
                              setCountryPopoverOpen(false);
                              return field.onChange(s);
                            }}
                          >
                            {countryName}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs text-muted-foreground">
                Note: Settlements and population data are only available
                currently for countries in Africa.
              </FormMessage>
            </FormItem>
          )}
        />
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
                              {RESOURCE_TYPES[item].label || item}
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
                      {Object.entries(RESOURCE_TYPES).map(
                        ([resourceName, resourceInfo]) => (
                          <CommandItem
                            key={resourceName}
                            onSelect={() => {
                              const newValue = field.value.includes(
                                resourceName,
                              )
                                ? field.value.filter(
                                    (item) => item !== resourceName,
                                  )
                                : [...field.value, resourceName];
                              field.onChange(newValue);
                            }}
                          >
                            <div
                              className={cn(
                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                field.value.includes(resourceName)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50',
                              )}
                            >
                              {field.value.includes(resourceName) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            {resourceInfo.label}
                          </CommandItem>
                        ),
                      )}
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
                  {Object.entries(ENGAGEMENT_TYPES).map(([value, label]) => (
                    <SelectItem
                      key={value}
                      value={value}
                      disabled={['village', 'municipality'].includes(value)}
                    >
                      {label}
                    </SelectItem>
                  ))}
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
                        captionLayout="dropdown"
                        fromDate={new Date(1900, 1, 1)}
                        toDate={new Date(2100, 12, 31)}
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
                        captionLayout="dropdown"
                        fromDate={new Date(1900, 1, 1)}
                        toDate={new Date(2100, 12, 31)}
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
              <StandardReportingFormLink
                engagementType={form.watch('engagementType')}
                monitoringFrequency={form.watch('monitoringFrequency')}
                startingDate={form.watch('startingDate')}
                endingDate={form.watch('endingDate')}
              />
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
