import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import styles from './page.module.css';
import {Globe} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Breadcrumbs from '@/components/Breadcrumbs';
import Link from 'next/link';
import UserButton from '@/components/user-button';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scale4Nature',
  description: 'Effective conservation scaling for sustainable impact',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="flex flex-col items-center min-h-screen">
          <header className="flex flex-row items-center w-full p-4 justify-between border-b border-gray-200">
            <Link href="/">
              <Image
                className={styles.logo}
                src="/scale4nature-logo.png"
                alt="scale4nature logo"
                width={880 / 5}
                height={224 / 5}
                priority
              />
            </Link>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-row items-center text-sm font-semibold">
                Effective conservation scaling for sustainable impact
              </div>
              <Globe />
              <UserButton />
            </div>
          </header>
          <Breadcrumbs />
          {children}
          <footer className="w-full flex flex-row items-center p-4 justify-between border-t border-gray-200">
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
                  <NavigationMenuTrigger className="space-x-2">
                    <Globe />
                    English (UK)
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>English (US)</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    Support & Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Help</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </footer>
        </div>
      </body>
    </html>
  );
}
