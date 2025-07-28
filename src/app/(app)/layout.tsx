import Image from 'next/image';
import styles from './page.module.css';
import {LogIn, User} from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {ProjectProvider} from '@/components/ProjectContext';
import {Button} from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {loggedIn} = await getProfile(supabase);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <header className="flex flex-row items-center w-full p-4 justify-between border-b border-gray-200 print:hidden">
        <Link
          href="/dashboard"
          className="flex flex-row items-center space-x-2"
        >
          <Image
            className={styles.logo}
            src="/scale4nature-logo.png"
            alt="scale4nature logo"
            width={880 / 5}
            height={224 / 5}
            priority
          />
          <span className="text-blue-300 text-xs lg:text-sm font-bold">
            Beta
          </span>
        </Link>
        <div className="flex flex-row space-x-4">
          <div className="flex-row items-center text-sm font-semibold text-muted-foreground hidden lg:flex">
            Effective conservation scaling for sustainable impact
          </div>
          {loggedIn ? (
            <Link
              href="/profile"
              className="flex flex-row items-center text-sm font-semibold print:hidden"
            >
              <Button variant="outline" className="flex items-center">
                <User />
                Account
              </Button>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex flex-row items-center text-sm font-semibold"
            >
              <Button className="flex items-center">
                <LogIn />
                Log In
              </Button>
            </Link>
          )}
        </div>
      </header>
      <ProjectProvider>
        <Breadcrumbs />
        {children}
      </ProjectProvider>
      <footer className="w-full flex flex-row items-center p-4 justify-between border-t border-gray-200 text-muted-foreground print:hidden">
        <div className="space-x-2">
          <Image
            className={`${styles.logo} inline`}
            src="/Imperial logo.png"
            alt="scale4nature logo"
            width={2142 / 20}
            height={562 / 20}
            priority
          />
          <Image
            className={`${styles.logo} inline`}
            src="/Leverhulme_Trust_CMYK_black.jpg"
            alt="scale4nature logo"
            width={1418 / 10}
            height={474 / 10}
            priority
          />
        </div>
        <div className="text-sm flex flex-row space-x-4">
          <a target="_blank" rel="noopener noreferrer">
            © 2025 Scale4Nature, LTD
          </a>
          <Link href="/faqs" className="hover:underline">
            FAQs
          </Link>
          <Link
            href="mailto:m.mills@imperial.ac.uk?subject=Scale4Nature Feedback&body=If reporting a specific issue, please include relevant any screenshots and steps to reproduce the issue or error"
            className="hover:underline"
          >
            Feedback
          </Link>
        </div>
      </footer>
    </div>
  );
}
