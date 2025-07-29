import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {createClient} from '@/lib/supabase/client';
import {Tables} from '@/lib/supabase/types/supabase';
import {
  getProfileDisplayName,
  getProfileInitials,
  getPublicStorageURL,
} from '@/lib/utils';
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';

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
      <Tooltip>
        <TooltipTrigger>
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
            className="object-cover"
          />
          <AvatarFallback className="select-none h-10 w-10">
            {getProfileInitials(profile)}
          </AvatarFallback>
        </TooltipTrigger>
        <TooltipContent>{getProfileDisplayName(profile)}</TooltipContent>
      </Tooltip>
    </Avatar>
  );
}
