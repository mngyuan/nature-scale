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
  onClose = () => {},
}: {
  profile: Tables<'profiles'>;
  show?: boolean;
  onClose(): void;
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
        onClose();
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

  useEffect(() => {
    if (show !== undefined) {
      setDialogOpen(show);
    }
  }, [show]);

  return (
    <Dialog open={dialogOpen} onOpenChange={updateDialogState}>
      <DialogContent>
        <Carousel setApi={setApi} className="w-full max-w-full overflow-hidden">
          <CarouselContent>
            <CarouselItem>
              <div className="text-center flex flex-col h-full">
                <DialogTitle>Welcome to Scale for Nature.</DialogTitle>
                <video
                  src="/demo.mp4"
                  autoPlay
                  loop
                  muted
                  className="m-12 h-48 object-cover rounded-lg border-2 border-gray-200 drop-shadow-md grow"
                />
                <DialogDescription className="text-left">
                  This tool will help you with three tasks. It will help you:
                </DialogDescription>
                <br />
                <ol className="list-decimal list-inside text-left text-sm text-muted-foreground space-y-4">
                  <li>
                    Define your scaling target by providing insight into the
                    number of adopters for a given nature conservation or
                    restoration initiative. This feature can currently only be
                    used for projects in Sub-Saharan Africa.
                  </li>
                  <li>
                    Use data from your existing project to estimate the current
                    trajectory of adoption and how likely you are to reach your
                    target
                  </li>
                  <li>
                    Help you understand how you might improve the speed and
                    extent to which your project will scale
                  </li>
                </ol>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <DialogTitle>Collaborate</DialogTitle>
                <img
                  src="/collaboration.png"
                  className="p-12 grow object-contain mb-2"
                />
                <DialogDescription>
                  You can invite your colleagues to collaborate. Just ask them
                  to set up an account.
                </DialogDescription>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <img
                  src="/example project.jpg"
                  className="p-12 grow object-cover mb-2"
                />
                <DialogDescription>
                  We've started you off with an example project to help you get
                  familiar with the interface and features. you can explore this
                  project or create your own.
                </DialogDescription>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="p-1 text-center flex flex-col h-full">
                <DialogTitle>Feedback welcome!</DialogTitle>
                <MailQuestion className="w-24 h-24 mx-auto mb-2 grow" />
                <DialogDescription>
                  You have early access to the beta version of Scale for Nature.
                  <br />
                  <br />
                  If you have any questions, comments or concerns, please send
                  any feedback (screenshots encouraged) to:
                  <br />
                  <br />
                  <Link
                    href="mailto:m.mills@imperial.ac.uk?subject=Scale for Nature Feedback&body=If reporting a specific issue, please include relevant any screenshots and steps to reproduce the issue or error"
                    className="hover:underline inline"
                  >
                    m.mills@imperial.ac.uk
                  </Link>
                  .
                </DialogDescription>
              </div>
            </CarouselItem>
          </CarouselContent>
          {current !== 1 && <CarouselPrevious className="left-0" />}
          {current !== count && <CarouselNext className="right-0" />}
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
