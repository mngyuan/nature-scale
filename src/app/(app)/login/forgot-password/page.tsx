import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {Metadata} from 'next';
import Image from 'next/image';
import {redirect} from 'next/navigation';
import {Suspense} from 'react';

export default async function ForgotPasswordPage() {
  const supabase = await createClient();
  const {loggedIn} = await getProfile(supabase);

  // Redirect if logged in
  if (loggedIn) {
    redirect('/profile');
  }

  return (
    <main className="flex flex-col grow w-full">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 pt-12">
        <div className="flex w-full items-end rounded-lg p-3">
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
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: 'Forgot Password',
};
