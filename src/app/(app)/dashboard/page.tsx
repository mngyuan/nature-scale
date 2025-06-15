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
import {getProfile} from '@/lib/utils';
import APIStatusIndicator from '@/components/APIStatusIndicator';
import {redirect} from 'next/navigation';
import {Tables} from '@/lib/supabase/types/supabase';
import {Metadata} from 'next';
import NUXDialog from '@/components/NUXDialog';

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
      <PeopleList>
        <ProfileHead src="/matt.jpeg" />
        <ProfileHead src="/morena.jpeg" />
        <ProfileHead src="/marco.jpeg" />
        <ProfileHead src="/kevin.jpeg" />
      </PeopleList>
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
        const {data} = supabase.storage
          .from('project-images')
          .getPublicUrl(project.project_image_url);

        if (data) {
          projectImages[project.id] = data.publicUrl;
        }
      }
    }
  }

  return (
    <main className="flex flex-col grow w-full">
      {profile && <NUXDialog profile={profile} />}
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
      <div className="px-8 pb-4 grow flex flex-col justify-between gap-4">
        <Tabs defaultValue="my-projects">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
            <TabsTrigger value="projects-to-update">
              Projects to update
            </TabsTrigger>
          </TabsList>
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
