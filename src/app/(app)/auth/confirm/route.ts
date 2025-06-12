import {type EmailOtpType} from '@supabase/supabase-js';
import {NextResponse, type NextRequest} from 'next/server';

import {createClient} from '@/lib/supabase/server';
import {redirect} from 'next/navigation';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next');

  if (token_hash && type) {
    const supabase = await createClient();

    const {error} = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      console.log('Redirecting after OTP verified', next);
      return NextResponse.redirect(next || '/');
    } else {
      // redirect the user to an error page with some instructions
      const errorParams = new URLSearchParams({
        code: error.code || 'Unknown',
        message: error.message || 'OTP failed',
      });
      console.log('Error', next, error);
      redirect(`/error?${errorParams.toString()}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error');
}
