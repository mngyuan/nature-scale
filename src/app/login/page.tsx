import Image from 'next/image';
import {Suspense} from 'react';

import LogInSignUpForm from '@/components/LogInSignUpForm';

export default async function LoginPage() {
  return (
    <main className="flex flex-col grow w-full">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <Image
              src="/scale4nature-logo.png"
              alt="scale4nature logo"
              width={880 / 5}
              height={224 / 5}
              priority
            />
          </div>
        </div>
        <Suspense>
          <LogInSignUpForm />
        </Suspense>
      </div>
    </main>
  );
}
