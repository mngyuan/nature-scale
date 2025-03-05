import {ArrowRight, Plus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const ProjectCard = () => (
  <Card className="w-sm">
    <CardHeader>
      <CardTitle>Rangelands in South Africa</CardTitle>
      <CardDescription>
        Community-driven livestock management model for rangeland restoration,
        biodiversity conservation and improved livelihoods.
      </CardDescription>
    </CardHeader>
    <CardContent></CardContent>
    <CardFooter>
      <Link href="/rangelands-in-south-africa">
        <Button>
          <ArrowRight />
          View project
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function Home() {
  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-row justify-between items-center px-8 py-4">
        <h2 className="text-3xl">Welcome back, Matt!</h2>
        <Button className="p-6 drop-shadow-lg rounded-lg">
          <Plus />
          Create a new project
        </Button>
      </div>
      <div className="px-8">
        <Tabs defaultValue="my-projects">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
            <TabsTrigger value="projects-to-update">
              Projects to update
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="flex flex-row">
            <ProjectCard />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
