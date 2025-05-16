'use client';

import {useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
import {titleCase} from 'title-case';
import errorCodes from '@/lib/supabase/auth-error-codes.json';

// this type is actually AuthError['code'] un-union'd with undefined and empty
// object from supabase-js; it's not exported so it's been reproduced in JSON
type ErrorCode = keyof typeof errorCodes;

const errorMessages: Partial<Record<ErrorCode, [string, string]>> = {
  ...{
    email_not_confirmed: [
      'Email not confirmed',
      'Please check your email inbox and verify your account before logging in.',
    ],
    email_address_invalid: [
      'Invalid email address',
      errorCodes.email_address_invalid,
    ],
    email_exists: [
      'Email already exists',
      'The email address you entered is already associated with an account.',
    ],
  },
  // Load default supabase error messages as default fallbacks
  ...Object.entries(errorCodes).reduce((acc, [key, value]) => {
    return {...acc, [key]: [titleCase(key.replace(/_/g, ' ')), value]};
  }, {}),
};

function ErrorMessage() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const errorMessage = errorMessages[code as keyof typeof errorMessages];

  if (errorMessage) {
    return (
      <>
        <h2 className="p-8 text-3xl">Sorry, something went wrong</h2>
        <h3 className="p-8 text-2xl">{errorMessage[0]}</h3>
        <div className="pl-8">
          <p>{errorMessage[1]}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="p-8 text-3xl">Sorry, something went wrong</h2>
      <h3 className="p-8 text-2xl">{code}</h3>
      <div className="pl-8">
        <p>{message}</p>
      </div>
    </>
  );
}

export default function ErrorPage() {
  return (
    <main className="flex flex-col grow w-full">
      <Suspense>
        <ErrorMessage />
      </Suspense>
    </main>
  );
}
