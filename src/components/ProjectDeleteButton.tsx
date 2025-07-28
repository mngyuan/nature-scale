'use client';

import {Tables} from '@/lib/supabase/types/supabase';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {LoaderCircle, Trash, X} from 'lucide-react';
import {createClient} from '@/lib/supabase/client';
import {useRouter} from 'next/navigation';
import {useUpdateStates} from '@/lib/hooks';

export default function ProjectDeleteButton({
  project,
}: {
  project: Tables<'projects'>;
}) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();

  useEffect(() => {
    if (dialogOpen === true) {
      setTimeout(() => setDeleteButtonDisabled(false), 3000);
    } else {
      setDeleteButtonDisabled(true);
    }
  }, [dialogOpen]);

  const deleteProject = async () => {
    if (!project?.id) {
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const resp = await supabase.from('projects').delete().eq('id', project.id);
    console.log(resp);
    const error = resp.error;
    if (error) {
      console.error('Error deleting project:', error);
      setError('Error deleting project:' + error.message);
    } else {
      setMessage('Deleted. Redirecting...');
      router.push('/dashboard');
    }
    setDialogOpen(false);
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setDialogOpen((dialogOpen) => !dialogOpen)}
      >
        <Trash />
        Delete Project
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-row items-center justify-between gap-2">
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="grow"
            >
              <X />
              Cancel
            </Button>
            <Button
              onClick={deleteProject}
              className="grow"
              variant="destructive"
              disabled={deleteButtonDisabled || loading}
            >
              {loading ? (
                <LoaderCircle className="w-2 h-2 animate-spin" />
              ) : message ? (
                'Deleted!'
              ) : (
                <>
                  <Trash />
                  Delete
                </>
              )}
            </Button>
          </div>

          {message && (
            <div className="text-sm text-muted-foreground">{message}</div>
          )}

          {error && <div className="text-sm text-red-500 ">{error}</div>}
        </DialogContent>
      </Dialog>
    </>
  );
}
