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
import {User} from '@supabase/supabase-js';

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
    .array(z.string())
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AF">Afghanistan</SelectItem>
                  <SelectItem value="AL">Albania</SelectItem>
                  <SelectItem value="DZ">Algeria</SelectItem>
                  <SelectItem value="AD">Andorra</SelectItem>
                  <SelectItem value="AO">Angola</SelectItem>
                  <SelectItem value="AG">Antigua and Barbuda</SelectItem>
                  <SelectItem value="AR">Argentina</SelectItem>
                  <SelectItem value="AM">Armenia</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="AT">Austria</SelectItem>
                  <SelectItem value="AZ">Azerbaijan</SelectItem>
                  <SelectItem value="BS">Bahamas</SelectItem>
                  <SelectItem value="BH">Bahrain</SelectItem>
                  <SelectItem value="BD">Bangladesh</SelectItem>
                  <SelectItem value="BB">Barbados</SelectItem>
                  <SelectItem value="BY">Belarus</SelectItem>
                  <SelectItem value="BE">Belgium</SelectItem>
                  <SelectItem value="BZ">Belize</SelectItem>
                  <SelectItem value="BJ">Benin</SelectItem>
                  <SelectItem value="BT">Bhutan</SelectItem>
                  <SelectItem value="BO">Bolivia</SelectItem>
                  <SelectItem value="BA">Bosnia and Herzegovina</SelectItem>
                  <SelectItem value="BW">Botswana</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                  <SelectItem value="BN">Brunei</SelectItem>
                  <SelectItem value="BG">Bulgaria</SelectItem>
                  <SelectItem value="BF">Burkina Faso</SelectItem>
                  <SelectItem value="BI">Burundi</SelectItem>
                  <SelectItem value="KH">Cambodia</SelectItem>
                  <SelectItem value="CM">Cameroon</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="CV">Cape Verde</SelectItem>
                  <SelectItem value="CF">Central African Republic</SelectItem>
                  <SelectItem value="TD">Chad</SelectItem>
                  <SelectItem value="CL">Chile</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="CO">Colombia</SelectItem>
                  <SelectItem value="KM">Comoros</SelectItem>
                  <SelectItem value="CI">Cote d Ivoire</SelectItem>
                  <SelectItem value="HR">Croatia</SelectItem>
                  <SelectItem value="CU">Cuba</SelectItem>
                  <SelectItem value="CY">Cyprus</SelectItem>
                  <SelectItem value="CZ">Czechia</SelectItem>
                  <SelectItem value="CD">
                    Democratic Republic of the Congo
                  </SelectItem>
                  <SelectItem value="DK">Denmark</SelectItem>
                  <SelectItem value="DJ">Djibouti</SelectItem>
                  <SelectItem value="DM">Dominica</SelectItem>
                  <SelectItem value="DO">Dominican Republic</SelectItem>
                  <SelectItem value="EC">Ecuador</SelectItem>
                  <SelectItem value="EG">Egypt</SelectItem>
                  <SelectItem value="SV">El Salvador</SelectItem>
                  <SelectItem value="GQ">Equatorial Guinea</SelectItem>
                  <SelectItem value="ER">Eritrea</SelectItem>
                  <SelectItem value="EE">Estonia</SelectItem>
                  <SelectItem value="SZ">Eswatini</SelectItem>
                  <SelectItem value="ET">Ethiopia</SelectItem>
                  <SelectItem value="FJ">Fiji</SelectItem>
                  <SelectItem value="FI">Finland</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="GA">Gabon</SelectItem>
                  <SelectItem value="GE">Georgia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="GH">Ghana</SelectItem>
                  <SelectItem value="GR">Greece</SelectItem>
                  <SelectItem value="GD">Grenada</SelectItem>
                  <SelectItem value="GT">Guatemala</SelectItem>
                  <SelectItem value="GN">Guinea</SelectItem>
                  <SelectItem value="GW">Guinea Bissau</SelectItem>
                  <SelectItem value="GY">Guyana</SelectItem>
                  <SelectItem value="HT">Haiti</SelectItem>
                  <SelectItem value="HN">Honduras</SelectItem>
                  <SelectItem value="HU">Hungary</SelectItem>
                  <SelectItem value="IS">Iceland</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="ID">Indonesia</SelectItem>
                  <SelectItem value="IR">Iran</SelectItem>
                  <SelectItem value="IQ">Iraq</SelectItem>
                  <SelectItem value="IE">Ireland</SelectItem>
                  <SelectItem value="IL">Israel</SelectItem>
                  <SelectItem value="IT">Italy</SelectItem>
                  <SelectItem value="JM">Jamaica</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="JO">Jordan</SelectItem>
                  <SelectItem value="KZ">Kazakhstan</SelectItem>
                  <SelectItem value="KE">Kenya</SelectItem>
                  <SelectItem value="KI">Kiribati</SelectItem>
                  <SelectItem value="KW">Kuwait</SelectItem>
                  <SelectItem value="KG">Kyrgyzstan</SelectItem>
                  <SelectItem value="LA">Laos</SelectItem>
                  <SelectItem value="LV">Latvia</SelectItem>
                  <SelectItem value="LB">Lebanon</SelectItem>
                  <SelectItem value="LS">Lesotho</SelectItem>
                  <SelectItem value="LR">Liberia</SelectItem>
                  <SelectItem value="LY">Libya</SelectItem>
                  <SelectItem value="LI">Liechtenstein</SelectItem>
                  <SelectItem value="LT">Lithuania</SelectItem>
                  <SelectItem value="LU">Luxembourg</SelectItem>
                  <SelectItem value="MG">Madagascar</SelectItem>
                  <SelectItem value="MW">Malawi</SelectItem>
                  <SelectItem value="MY">Malaysia</SelectItem>
                  <SelectItem value="MV">Maldives</SelectItem>
                  <SelectItem value="ML">Mali</SelectItem>
                  <SelectItem value="MT">Malta</SelectItem>
                  <SelectItem value="MH">Marshall Islands</SelectItem>
                  <SelectItem value="MR">Mauritania</SelectItem>
                  <SelectItem value="MU">Mauritius</SelectItem>
                  <SelectItem value="MX">Mexico</SelectItem>
                  <SelectItem value="FM">Micronesia</SelectItem>
                  <SelectItem value="MD">Moldova</SelectItem>
                  <SelectItem value="MC">Monaco</SelectItem>
                  <SelectItem value="MN">Mongolia</SelectItem>
                  <SelectItem value="ME">Montenegro</SelectItem>
                  <SelectItem value="MA">Morocco</SelectItem>
                  <SelectItem value="MZ">Mozambique</SelectItem>
                  <SelectItem value="MM">Myanmar</SelectItem>
                  <SelectItem value="NA">Namibia</SelectItem>
                  <SelectItem value="NR">Nauru</SelectItem>
                  <SelectItem value="NP">Nepal</SelectItem>
                  <SelectItem value="NL">Netherlands</SelectItem>
                  <SelectItem value="NZ">New Zealand</SelectItem>
                  <SelectItem value="NI">Nicaragua</SelectItem>
                  <SelectItem value="NE">Niger</SelectItem>
                  <SelectItem value="NG">Nigeria</SelectItem>
                  <SelectItem value="KP">North Korea</SelectItem>
                  <SelectItem value="MK">North Macedonia</SelectItem>
                  <SelectItem value="NO">Norway</SelectItem>
                  <SelectItem value="OM">Oman</SelectItem>
                  <SelectItem value="PK">Pakistan</SelectItem>
                  <SelectItem value="PW">Palau</SelectItem>
                  <SelectItem value="PS">Palestine</SelectItem>
                  <SelectItem value="PA">Panama</SelectItem>
                  <SelectItem value="PG">Papua New Guinea</SelectItem>
                  <SelectItem value="PY">Paraguay</SelectItem>
                  <SelectItem value="PE">Peru</SelectItem>
                  <SelectItem value="PH">Philippines</SelectItem>
                  <SelectItem value="PL">Poland</SelectItem>
                  <SelectItem value="PT">Portugal</SelectItem>
                  <SelectItem value="QA">Qatar</SelectItem>
                  <SelectItem value="CG">Republic of the Congo</SelectItem>
                  <SelectItem value="RO">Romania</SelectItem>
                  <SelectItem value="RU">Russia</SelectItem>
                  <SelectItem value="RW">Rwanda</SelectItem>
                  <SelectItem value="KN">Saint Kitts and Nevis</SelectItem>
                  <SelectItem value="LC">Saint Lucia</SelectItem>
                  <SelectItem value="VC">
                    Saint Vincent and the Grenadines
                  </SelectItem>
                  <SelectItem value="WS">Samoa</SelectItem>
                  <SelectItem value="SM">San Marino</SelectItem>
                  <SelectItem value="ST">Sao Tome and Principe</SelectItem>
                  <SelectItem value="SA">Saudi Arabia</SelectItem>
                  <SelectItem value="SN">Senegal</SelectItem>
                  <SelectItem value="RS">Serbia</SelectItem>
                  <SelectItem value="SC">Seychelles</SelectItem>
                  <SelectItem value="SL">Sierra Leone</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="SK">Slovakia</SelectItem>
                  <SelectItem value="SI">Slovenia</SelectItem>
                  <SelectItem value="SB">Solomon Islands</SelectItem>
                  <SelectItem value="SO">Somalia</SelectItem>
                  <SelectItem value="ZA">South Africa</SelectItem>
                  <SelectItem value="KR">South Korea</SelectItem>
                  <SelectItem value="SS">South Sudan</SelectItem>
                  <SelectItem value="ES">Spain</SelectItem>
                  <SelectItem value="LK">Sri Lanka</SelectItem>
                  <SelectItem value="SD">Sudan</SelectItem>
                  <SelectItem value="SR">Suriname</SelectItem>
                  <SelectItem value="SE">Sweden</SelectItem>
                  <SelectItem value="CH">Switzerland</SelectItem>
                  <SelectItem value="SY">Syria</SelectItem>
                  <SelectItem value="TW">Taiwan</SelectItem>
                  <SelectItem value="TJ">Tajikistan</SelectItem>
                  <SelectItem value="TZ">Tanzania</SelectItem>
                  <SelectItem value="TH">Thailand</SelectItem>
                  <SelectItem value="TL">Timor-Leste</SelectItem>
                  <SelectItem value="TG">Togo</SelectItem>
                  <SelectItem value="TO">Tonga</SelectItem>
                  <SelectItem value="TT">Trinidad and Tobago</SelectItem>
                  <SelectItem value="TN">Tunisia</SelectItem>
                  <SelectItem value="TR">Turkey</SelectItem>
                  <SelectItem value="TM">Turkmenistan</SelectItem>
                  <SelectItem value="TV">Tuvalu</SelectItem>
                  <SelectItem value="UG">Uganda</SelectItem>
                  <SelectItem value="UA">Ukraine</SelectItem>
                  <SelectItem value="AE">United Arab Emirates</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UY">Uruguay</SelectItem>
                  <SelectItem value="UZ">Uzbekistan</SelectItem>
                  <SelectItem value="VU">Vanuatu</SelectItem>
                  <SelectItem value="VA">Vatican City</SelectItem>
                  <SelectItem value="VE">Venezuela</SelectItem>
                  <SelectItem value="VN">Vietnam</SelectItem>
                  <SelectItem value="YE">Yemen</SelectItem>
                  <SelectItem value="ZM">Zambia</SelectItem>
                  <SelectItem value="ZW">Zimbabwe</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
