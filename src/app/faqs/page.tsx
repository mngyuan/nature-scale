import Link from 'next/link';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {Globe} from 'lucide-react';

export default async function FAQsPage() {
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
          <div className="flex flex-col space-y-4 font-medium space-y-8">
            <h2 className="font-semibold text-2xl lg:text-3xl">
              Frequently Asked Questions
            </h2>
            <ol className="list-decimal list-outside space-y-8">
              <li className="text-xl lg:text-2xl space-y-2">
                <h3>Who is this tool for?</h3>
                <p className="text-base font-normal">
                  Scale4Nature is designed for conservation practitioners,
                  researchers, and decision-makers who want to scale their
                  conservation efforts effectively.
                </p>
              </li>
              <li className="text-xl lg:text-2xl space-y-2">
                <h3>What are the main use cases for this tool?</h3>
                <p className="text-base font-normal">
                  You can use this tool to identify the potential reach of your
                  conservation efforts, assess the progress of ongoing
                  initiatives, and analyze and receive recommendations on the
                  factors that influence adoption.
                </p>
              </li>
              <li className="text-xl lg:text-2xl space-y-2">
                <h3>Where is my data and how is it stored and used?</h3>
                <p className="text-base font-normal">
                  Only data that's deemed necessary for continued operation of
                  the tool is stored. Data for computation, for example, is only
                  used to make the requested figures or computations. Stored
                  data is stored in Supabase.
                </p>
              </li>
              <li className="text-xl lg:text-2xl space-y-2">
                <h3>
                  What are some things I should keep in mind when I'm making
                  decisions using this tool?
                </h3>
                <p className="text-base font-normal">
                  While Scale4Nature provides valuable insights, it is important
                  to remember that it is a forecasting tool based on
                  probabilistic modeling.
                </p>
              </li>
            </ol>
          </div>
        </div>
        <Link href="/login?show=signup" className="text-sm font-semibold">
          <Button className="mt-8">Try it out</Button>
        </Link>
      </main>
    </div>
  );
}
