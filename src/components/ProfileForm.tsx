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

const ProfileFormSchema = z.object({
  firstName: z.string().min(1, {message: 'First name is required'}),
  lastName: z.string().min(1, {message: 'Last name is required'}),
});

export default function ProfileForm({
  user,
  profile,
}: {
  user: User | null;
  // TODO: supabase typescript type generation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
    },
  });

  async function onSubmit(data: z.infer<typeof ProfileFormSchema>) {
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
      console.error('Error updating profile:', error);
      // TODO: display to user
      // alert('Error updating profile');
    } else {
      // TODO: show a success toast?
      console.log('Profile updated successfully', user?.id);
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
            {loading ? 'Loading ...' : 'Update'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
