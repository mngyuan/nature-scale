import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {Plus} from 'lucide-react';

export default async function Page() {
  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Create a new project</h2>
      <div className="flex flex-col grow px-8 pb-8 space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>Project Name</Label>
          <Input placeholder="Name of the project" />
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Project Description</Label>
          <Textarea placeholder="Add a description to your project" />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="project-photo">Project Photo</Label>
          <Input type="file" id="project-photo" />
        </div>
        <Separator className="mt-4 mb-6" />
        <div className="flex flex-col space-y-2">
          <Label>Resources Type</Label>
          <Select>
            <SelectTrigger className="w-full">
              Select one or more resource types
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Region 1</SelectItem>
              <SelectItem value="2">Region 2</SelectItem>
              <SelectItem value="3">Region 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Engagement Type</Label>
          <Select>
            <SelectTrigger className="w-full">
              Select one engagement type
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Region 1</SelectItem>
              <SelectItem value="2">Region 2</SelectItem>
              <SelectItem value="3">Region 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <Label>Monitoring Frequency</Label>
          <Select>
            <SelectTrigger className="w-full">Every 2 months</SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Region 1</SelectItem>
              <SelectItem value="2">Region 2</SelectItem>
              <SelectItem value="3">Region 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <Button className="mt-4">
          <Plus />
          Create Project
        </Button>
      </div>
    </main>
  );
}
