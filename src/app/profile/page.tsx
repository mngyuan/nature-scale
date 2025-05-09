import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {loggedIn, profile} = await getProfile(supabase);

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Profile</h2>
      <div className="grid grid-cols-2 gap-4 px-8 pb-8 space-x-6">
        {loggedIn ? profile?.first_name : null}
      </div>
    </main>
  );
}
