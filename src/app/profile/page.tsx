import ProfileForm from '@/components/ProfileForm';
import ProfilePictureForm from '@/components/ProfilePictureForm';
import {Button} from '@/components/ui/button';
import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {redirect} from 'next/navigation';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {loggedIn, profile} = await getProfile(supabase);
  const {
    data: {user},
  } = await supabase.auth.getUser();

  // Redirect if not logged in
  if (!loggedIn) {
    redirect('/login');
  }

  return (
    <main className="flex flex-col grow w-full">
      <h2 className="p-8 text-3xl">Account</h2>
      <div className="flex flex-col gap-8 px-8 pb-8 space-x-6 w-lg">
        {loggedIn && (
          <>
            <ProfileForm user={user} profile={profile} />

            <div>
              <h3 className="text-2xl mb-4">Profile Picture</h3>
              <ProfilePictureForm
                uid={user?.id ?? null}
                url={profile?.profile_picture_url ?? ''}
                size={150}
                onUploadAction={
                  null
                  // (url: string) => {
                  // updateProfile({fullname, username, website, avatar_url: url});
                  // }
                }
              />
            </div>

            <form action="/auth/signout" method="post">
              <Button className="button block" type="submit">
                Sign out
              </Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
