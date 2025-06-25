import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import {redirect} from 'next/navigation';
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
              Scale4nature is an adaptive management tool to help forecast and
              manage the trajectory a programme is likely to take.
            </h2>
            <p className="text-sm lg:text-md">
              Track and forecast from failure to launch to widespread adoption,
              with just a handful of years of initial data and basic insights on
              the program’s fit. The tool will help estimate the number of
              potential adopters of conservation initiatives and, if the
              programme is off track, can suggest reasons why.
            </p>
            <p className="text-sm lg:text-md">
              Make evidence informed decisions and track the mechanism(s) of
              spread – whether it's social or independent learning – to manage
              the impact of your project over the years or decades to come.
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
