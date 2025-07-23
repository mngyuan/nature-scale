import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {createClient} from '@/lib/supabase/client';
import {Tables} from '@/lib/supabase/types/supabase';
import {
  getProfileDisplayName,
  getProfileInitials,
  getPublicStorageURL,
} from '@/lib/utils';

export default function ProfileHead({
  profile,
  className = '',
}: {
  profile:
    | Tables<'profiles'>
    | {
        first_name: string | null;
        last_name: string | null;
        profile_picture_url: string | null;
      };
  className?: string;
}) {
  const supabase = createClient();
  return (
    <Avatar className={className}>
      <AvatarImage
        src={
          profile.profile_picture_url
            ? getPublicStorageURL(
                supabase,
                'profile-photos',
                profile.profile_picture_url,
              ) || undefined
            : undefined
        }
        alt={getProfileDisplayName(profile)}
      />
      <AvatarFallback className="select-none">
        {getProfileInitials(profile)}
      </AvatarFallback>
    </Avatar>
  );
}
