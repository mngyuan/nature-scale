'use client';

import Link from 'next/link';
import {useSearchParams} from 'next/navigation';

const errorMessages = {
  email_not_confirmed: [
    'Email not confirmed',
    'Please check your email inbox and verify your account before logging in.',
  ],
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const errorMessage = errorMessages[code as keyof typeof errorMessages];

  if (errorMessage) {
    return (
      <main className="flex flex-col grow w-full">
        <h2 className="p-8 text-3xl">{errorMessage[0]}</h2>
        <div className="pl-8">
          <p>{errorMessage[1]}</p>
          <Link href="/login" className="font-semibold hover:underline">
            Return to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Sorry, something went wrong</h2>
      <div className="pl-8">
        <p>Error code: {code}</p>
        <p>{message}</p>
        <Link href="/login" className="font-semibold hover:underline">
          Return to Login
        </Link>
      </div>
    </main>
  );
}
