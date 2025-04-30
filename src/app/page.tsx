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
import Image from 'next/image';
import {createClient} from '@/utils/supabase/server';

const PeopleList = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => (
  <div className="flex flex-row -space-x-2">{children}</div>
);
const ProfileHead = ({src}: {src: string}): React.JSX.Element => (
  <div className="w-12 h-12 border-grey-500 border-1 rounded-full">
    <div className="rounded-full overflow-hidden border-white border-3">
      <Image src={src} alt="Profile picture" width={48} height={48} />
    </div>
  </div>
);

const ProjectCard = ({
  name,
  description,
}: {name?: string; description?: string} = {}) => (
  <Card className="w-sm pt-0 overflow-hidden">
    <Image
      src="/rangelands.png"
      alt="Rangelands in South Africa"
      width={800}
      height={529}
    />
    <CardHeader className="grow">
      <CardTitle>{name}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <PeopleList>
        <ProfileHead src="/matt.jpeg" />
        <ProfileHead src="/morena.jpeg" />
        <ProfileHead src="/marco.jpeg" />
        <ProfileHead src="/kevin.jpeg" />
      </PeopleList>
    </CardContent>
    <CardFooter>
      <Link href="/rangelands-in-south-africa" className="w-full">
        <Button className="w-full">
          <ArrowRight />
          View project
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default async function Home() {
  const supabase = await createClient();
  const {data: projects} = await supabase.from('projects').select();
  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-row justify-between items-center px-8 py-4">
        <h2 className="text-3xl">Welcome back, Matt</h2>
        <Link href="/new-project">
          <Button className="p-6 drop-shadow-lg rounded-lg">
            <Plus />
            Create a new project
          </Button>
        </Link>
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
          <TabsContent value="my-projects" className="flex flex-row space-x-2">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                description={project.description}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
