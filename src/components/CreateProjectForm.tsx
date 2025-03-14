'use client';

import {Plus} from 'lucide-react';
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
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';

const CreateProjectFormSchema = z.object({
  projectName: z.string().min(1, {message: 'Project name is required'}),
  projectDescription: z.string().max(200, {message: 'Max 200 characters'}),
  projectPhoto: z.string(),
  resourcesType: z
    .string()
    .min(1, {message: 'At least 1 resource type is required'}),
  engagementType: z
    .string()
    .min(1, {message: 'At least 1 engagement type is required'}),
  monitoringFrequency: z.string(),
  startingDate: z.string(),
  endingDate: z.string(),
});

export default function CreateProjectForm() {
  const form = useForm<z.infer<typeof CreateProjectFormSchema>>({
    resolver: zodResolver(CreateProjectFormSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
      projectPhoto: '',
      // TODO: should be an array, check sersavan/shadcn-multi-select-component
      resourcesType: '',
      engagementType: '',
      monitoringFrequency: '',
      startingDate: '',
      endingDate: '',
    },
  });

  function onSubmit(data: z.infer<typeof CreateProjectFormSchema>) {
    console.log(data);
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
              <FormLabel>Resources Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select one or more resource types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Region 1</SelectItem>
                  <SelectItem value="2">Region 2</SelectItem>
                  <SelectItem value="3">Region 3</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="1">Region 1</SelectItem>
                  <SelectItem value="2">Region 2</SelectItem>
                  <SelectItem value="3">Region 3</SelectItem>
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
                  <SelectItem value="1">Region 1</SelectItem>
                  <SelectItem value="2">Region 2</SelectItem>
                  <SelectItem value="3">Region 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row w-full space-x-4">
          <div className="grow flex flex-col space-y-2">
            <Label>Starting Date</Label>
            <Input placeholder="118" />
          </div>
          <div className="grow flex flex-col space-y-2">
            <Label>Ending Date</Label>
            <Input placeholder="118" />
          </div>
        </div>
        <Button className="mt-4" type="submit">
          <Plus />
          Create Project
        </Button>
      </form>
    </Form>
  );
}
