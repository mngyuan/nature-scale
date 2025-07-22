'use client';

import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button} from '@/components/ui/button';
import {createClient} from '@/lib/supabase/client';
import {LoaderCircle} from 'lucide-react';
import {useUpdateStates} from '@/lib/hooks';
import {Tables} from '@/lib/supabase/types/supabase';
import {type User} from '@supabase/supabase-js';
import {Switch} from './ui/switch';

const CollaborationVisibilityFormSchema = z.object({
  visible: z.boolean(),
});

export default function CollaborationVisibilityForm({
  user,
  profile,
}: {
  user: User | null;
  profile: Tables<'profiles'> | null;
}) {
  const supabase = createClient();
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const form = useForm<z.infer<typeof CollaborationVisibilityFormSchema>>({
    resolver: zodResolver(CollaborationVisibilityFormSchema),
    defaultValues: {
      visible: profile?.search_visible ?? false,
    },
  });

  async function onSubmit(
    data: z.infer<typeof CollaborationVisibilityFormSchema>,
  ) {
    if (!user?.id) {
      console.error('User ID is not available');
      setError('User ID is not available. Please report this error.');
      return;
    }
    setLoading(true);

    const {error} = await supabase
      .from('profiles')
      .update({
        search_visible: data.visible,
      })
      .eq('id', user?.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage(
        `Updated your visibility! You are now ${data.visible ? 'visible' : 'hidden'} to others.`,
      );
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="visible"
          render={({field}) => (
            <FormItem className="flex flex-row justify-between">
              <FormLabel>
                Allow others to find me and add me to projects
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-start space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="w-2 h-2 animate-spin" />
            ) : message ? (
              'Success!'
            ) : (
              'Update Visibility'
            )}
          </Button>
        </div>

        {message && (
          <div className="text-sm text-muted-foreground">{message}</div>
        )}

        {error && <div className="text-sm text-red-500 ">{error}</div>}
      </form>
    </Form>
  );
}
