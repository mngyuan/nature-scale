'use client';

import {useCallback, useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Tables} from '@/lib/supabase/types/supabase';
import {createClient} from '@/lib/supabase/client';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Link from 'next/link';
import {MailQuestion} from 'lucide-react';

export default function NUXDialog({
  profile,
  show,
}: {
  profile: Tables<'profiles'>;
  show?: boolean;
}): JSX.Element {
  const supabase = createClient();
  const [dialogOpen, setDialogOpen] = useState(
    show != undefined ? show : !profile.seen_nux,
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const updateDialogState = useCallback(
    async (open: boolean) => {
      if (open === false) {
        await supabase
          .from('profiles')
          .update({seen_nux: new Date().toISOString()})
          .eq('id', profile.id);
      }
      setDialogOpen(open);
    },
    [profile.id],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <Dialog open={dialogOpen} onOpenChange={updateDialogState}>
      <DialogContent>
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <DialogTitle>Welcome to Scale4Nature.</DialogTitle>
                <img
                  src="/example project.jpg"
                  className="p-12 grow object-cover mb-2"
                />
                <DialogDescription>
                  We've started you off with an example project to help you get
                  familiar with the interface and features. You can explore this
                  project, or create your own.
                </DialogDescription>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <video
                  src="/demo.mp4"
                  autoPlay
                  loop
                  muted
                  className="m-12 h-48 object-cover rounded-lg border-2 border-gray-200 drop-shadow-md grow"
                />
                <DialogDescription>
                  This tool is designed to help you plan and manage your
                  conservation efforts, and to give you data-driven insights
                  into the potential impact of your projects and their progress.
                </DialogDescription>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <DialogTitle>Feedback welcome!</DialogTitle>
                <MailQuestion className="w-24 h-24 mx-auto mb-2 grow" />
                <DialogDescription>
                  Thanks for using this beta version of Scale4Nature.
                  <br />
                  <br />
                  If you have any questions, comments, or concerns, please send
                  any feedback (screenshots welcome) to{' '}
                  <Link
                    href="mailto:m.mills@imperial.ac.uk?subject=Scale4Nature Feedback&body=If reporting a specific issue, please include relevant any screenshots and steps to reproduce the issue or error"
                    className="hover:underline"
                  >
                    m.mills@imperial.ac.uk
                  </Link>
                  .
                </DialogDescription>
              </div>
            </CarouselItem>
          </CarouselContent>
          {current !== 1 && <CarouselPrevious />}
          {current !== count && <CarouselNext />}
        </Carousel>
        {current === count ? (
          <Button onClick={() => updateDialogState(false)}>Get started</Button>
        ) : (
          <Button onClick={() => api?.scrollNext()}>Next</Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
