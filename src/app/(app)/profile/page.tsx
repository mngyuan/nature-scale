import CollaborationVisibilityForm from '@/components/CollaborationVisibilityForm';
import ProfileForm from '@/components/ProfileForm';
import ProfilePictureForm from '@/components/ProfilePictureForm';
import {Button} from '@/components/ui/button';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';
import {createClient} from '@/lib/supabase/server';
import {getProfile} from '@/lib/utils';
import {Metadata} from 'next';
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
      <div className="flex flex-col gap-8 px-8 pb-8 w-full lg:w-lg">
        {loggedIn && (
          <>
            <ProfileForm user={user} profile={profile} />

            <div>
              <h3 className="text-2xl mb-4">Update your password</h3>
              <UpdatePasswordForm />
            </div>

            <div>
              <h3 className="text-2xl mb-4">Profile Picture</h3>
              <ProfilePictureForm size={150} user={user} profile={profile} />
            </div>

            <div>
              <h3 className="text-2xl mb-4">Visibility</h3>
              <CollaborationVisibilityForm user={user} profile={profile} />
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

export const metadata: Metadata = {
  title: 'Account',
};
