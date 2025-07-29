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
import {createClient} from '@/lib/supabase/server';
import {getProfile, getPublicStorageURL} from '@/lib/utils';
import APIStatusIndicator from '@/components/APIStatusIndicator';
import {redirect} from 'next/navigation';
import {Tables} from '@/lib/supabase/types/supabase';
import {Metadata} from 'next';
import {getProjectMembers} from './project/[slug]/actions';
import ProfileHead from '@/components/ProfileHead';
import NUXButton from '@/components/NUXButton';

const PeopleList = async ({
  project,
}: {
  project: Tables<'projects'>;
}): Promise<React.JSX.Element> => {
  const projectMembers = await getProjectMembers(project.id);

  return (
    <div className="flex flex-row -space-x-2">
      {projectMembers.map(
        (member) =>
          member.profiles && (
            <ProfileHead
              key={member.id}
              profile={member.profiles}
              className="h-10 w-10"
            />
          ),
      )}
    </div>
  );
};

const ProjectCard = ({
  project,
  projectImage,
}: {
  project: Tables<'projects'>;
  projectImage: string;
}): React.JSX.Element => (
  <Card className="w-sm pt-0 overflow-hidden">
    <Image
      src={projectImage || '/rangelands.png'}
      alt="Project photo"
      width={800}
      height={529}
      className="object-cover max-h-48 w-full"
    />
    <CardHeader className="grow">
      <CardTitle>{project.name}</CardTitle>
      <CardDescription>{project.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <PeopleList project={project} />
    </CardContent>
    <CardFooter>
      <Link href={`/dashboard/project/${project.id}`} className="w-full">
        <Button className="w-full">
          <ArrowRight />
          View project
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default async function Dashboard() {
  const supabase = await createClient();
  const {loggedIn, profile} = await getProfile(supabase);

  // Redirect if not logged in
  if (!loggedIn) {
    redirect('/login');
  }

  const {data} = await supabase.from('projects').select();
  const projects = data?.sort((p1, p2) =>
    p1.created_at.localeCompare(p2.created_at),
  );

  const projectImages: Record<string, string> = {};

  if (projects) {
    for (const project of projects) {
      if (project.project_image_url) {
        const publicURL = getPublicStorageURL(
          supabase,
          'project-images',
          project.project_image_url,
        );

        if (publicURL) {
          projectImages[project.id] = publicURL;
        }
      }
    }
  }

  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-row justify-between items-center px-8 py-4">
        <h2 className="text-3xl">
          {loggedIn && profile?.first_name
            ? `Welcome back, ${profile?.first_name}.`
            : 'Welcome!'}
        </h2>
        <Link href="/dashboard/new-project" className="hidden lg:block">
          <Button className="p-6 drop-shadow-lg rounded-lg">
            <Plus />
            Create a new project
          </Button>
        </Link>
      </div>
      <div className="px-8 pb-4 grow flex flex-col gap-4">
        <Tabs defaultValue="my-projects">
          <div className="flex flex-row items-center gap-2">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="my-projects">My projects</TabsTrigger>
              <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
            </TabsList>
            <NUXButton profile={profile} />
          </div>
          <TabsContent
            value="my-projects"
            className="flex flex-row flex-wrap gap-2"
          >
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                projectImage={projectImages[project.id] || ''}
              />
            ))}
          </TabsContent>
        </Tabs>
        <Link href="/dashboard/new-project" className="lg:hidden text-center">
          <Button className="p-6 drop-shadow-lg rounded-lg ">
            <Plus />
            Create a new project
          </Button>
        </Link>
        <APIStatusIndicator />
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Dashboard',
};
