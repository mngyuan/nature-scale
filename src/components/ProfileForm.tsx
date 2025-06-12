'use client';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {z} from 'zod';
import {createClient} from '@/lib/supabase/client';
import {type User} from '@supabase/supabase-js';
import {Tables} from '@/lib/supabase/types/supabase';
import {useUpdateStates} from '@/lib/hooks';
import {LoaderCircle} from 'lucide-react';

const ProfileFormSchema = z.object({
  firstName: z.string().min(1, {message: 'First name is required'}),
  lastName: z.string().min(1, {message: 'Last name is required'}),
});

export default function ProfileForm({
  user,
  profile,
}: {
  user: User | null;
  profile: Tables<'profiles'> | null;
}) {
  const supabase = createClient();
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
    },
  });

  async function onSubmit(data: z.infer<typeof ProfileFormSchema>) {
    if (!user?.id) {
      console.error('User ID is not available');
      setError('User ID is not available. Please report this error.');
      return;
    }
    setLoading(true);

    const {error} = await supabase
      .from('profiles')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Updated your profile!');
    }
    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-2xl mb-4">Profile</h3>
      <Form {...form}>
        <form
          className="flex flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input disabled value={user?.email} />
            <FormMessage />
          </FormItem>
          <FormField
            control={form.control}
            name="firstName"
            render={({field}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <Input {...field} placeholder="Jane" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({field}) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <Input {...field} placeholder="Doe" />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="w-2 h-2 animate-spin" />
            ) : message ? (
              'Success!'
            ) : (
              'Update Profile'
            )}
          </Button>

          {message && (
            <div className="text-sm text-muted-foreground">{message}</div>
          )}

          {error && <div className="text-sm text-red-500 ">{error}</div>}
        </form>
      </Form>
    </div>
  );
}
