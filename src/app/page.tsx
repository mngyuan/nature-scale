import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {Globe} from 'lucide-react';
import {Button} from '@/components/ui/button';

export default async function RootPage() {
  const supabase = await createClient();
  const {loggedIn} = await getProfile(supabase);

  return (
    <div className="flex flex-col grow min-w-screen min-h-screen p-8 lg:p-12 relative">
      <div className="absolute -z-1 top-0 left-0 w-full h-full bg-[url(/pexels-b.jpg)] bg-cover bg-center opacity-30"></div>
      <header className="flex flex-row items-center w-full lg:p-16 justify-between">
        <Link href="/">
          <Image
            src="/scale4nature-logo.png"
            alt="scale4nature logo"
            width={880 / 5}
            height={224 / 5}
            priority
          />
        </Link>
        <div className="flex flex-row items-center space-x-4">
          <div className="flex flex-row items-center text-sm font-semibold hidden lg:block">
            Effective conservation scaling for sustainable impact
          </div>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="flex flex-row items-center text-sm font-semibold"
            >
              <Button variant="secondary" className="flex items-center">
                <Globe />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="flex flex-row items-center text-sm font-semibold"
              >
                <Button variant="secondary">Log In</Button>
              </Link>
              <Link
                href="/login?show=signup"
                className="flex flex-row items-center text-sm font-semibold"
              >
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="flex flex-col grow w-full h-full py-8 lg:p-16">
        <div className="flex w-full lg:w-128 h-full flex-col space-between space-y-4">
          <div className="flex flex-col space-y-4 font-medium">
            <h2 className="font-semibold text-2xl lg:text-3xl">
              ScaleForNature is a tool to forecast and adaptively manage how
              conservation and restoration projects go to scale.
            </h2>
            <p className="text-sm lg:text-md">
              Use models from quantitative social science to estimate how your
              project will scale over time and, if your project is off track,
              suggest practical ways to improve the speed, extent, and stability
              of adoption.
            </p>
            <p className="text-sm lg:text-md">
              Empower yourself to make evidence informed decisions and
              adaptively manage the uptake of your project over the years to
              come.
            </p>
          </div>
        </div>
        <Link href="/login?show=signup" className="text-sm font-semibold">
          <Button className="mt-8">Try it out</Button>
        </Link>
      </main>
    </div>
  );
}
