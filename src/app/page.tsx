import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {redirect} from 'next/navigation';

export default async function RootPage() {
  const supabase = await createClient();
  const {loggedIn, profile} = await getProfile(supabase);

  // Redirect logged in
  if (loggedIn) {
    redirect('/dashboard');
  }

  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-row justify-between items-center px-8 py-4">
        <h2 className="text-3xl">
          {loggedIn && profile?.first_name
            ? `Welcome back, ${profile?.first_name}.`
            : 'Welcome!'}
        </h2>
      </div>
    </main>
  );
}
