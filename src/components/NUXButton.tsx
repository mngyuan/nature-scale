'use client';

import {Tables} from '@/lib/supabase/types/supabase';
import {Button} from '@/components/ui/button';
import NUXDialog from '@/components/NUXDialog';
import {useState} from 'react';

export default function NUXButton({
  profile,
}: {
  profile: Tables<'profiles'> | null;
}) {
  const [dialogOpen, setDialogOpen] = useState(!profile?.seen_nux);

  return (
    <>
      {profile && (
        <NUXDialog
          profile={profile}
          show={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
      <Button
        className="font-bold text-gray-500 rounded-lg hidden lg:block flex items-center justify-center"
        variant="secondary"
        onClick={() => setDialogOpen((dialogOpen) => !dialogOpen)}
      >
        ?
      </Button>
    </>
  );
}
