import Image from 'next/image';
import styles from './page.module.css';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {ArrowRight, Globe, Plus} from 'lucide-react';
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

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center">
      <header className="flex flex-row w-full p-4 justify-between border-b border-gray-200">
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={135}
          height={29}
          priority
        />
        <div className="flex flex-row space-x-4">
          <div className="">
            Effective conservation scaling for sustainable impact
          </div>
          <Globe />
        </div>
      </header>
      <main className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center px-8 py-4">
          <h2 className="text-3xl">Welcome back, Matt!</h2>
          <Button className="p-6 drop-shadow-lg rounded-lg">
            <Plus />
            Create a new project
          </Button>
        </div>
        <Tabs defaultValue="my-projects">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="my-projects">My projects</TabsTrigger>
            <TabsTrigger value="shared-with-me">Shared with me</TabsTrigger>
            <TabsTrigger value="projects-to-update">
              Projects to update
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="flex flex-row">
            <Card>
              <CardHeader>
                <CardTitle>Rangelands in South Africa</CardTitle>
                <CardDescription>
                  Community-driven livestock management model for rangeland
                  restoration, biodiversity conservation and improved
                  livelihoods.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <Button>
                  <ArrowRight />
                  View project
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rangelands in South Africa</CardTitle>
                <CardDescription>
                  Community-driven livestock management model for rangeland
                  restoration, biodiversity conservation and improved
                  livelihoods.
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter>
                <Button>
                  <ArrowRight />
                  View project
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="w-full flex flex-row p-4 justify-between border-t border-gray-200">
        <div className="text-sm flex flex-row space-x-4">
          <a target="_blank" rel="noopener noreferrer">
            © 2025 Scale4Nature, LTD
          </a>
          <a target="_blank" rel="noopener noreferrer">
            Terms
          </a>
          <a target="_blank" rel="noopener noreferrer">
            Sitemap
          </a>
          <a target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
        </div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Globe />
                English (UK)
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>English (US)</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Support & Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>Help</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </footer>
    </div>
  );
}
