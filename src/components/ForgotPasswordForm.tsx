'use client';

import {useEffect} from 'react';
import {LoaderCircle} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {createClient} from '@/lib/supabase/client';
import {useUpdateStates} from '@/lib/hooks';

const ForgotPasswordFormSchema = z.object({
  email: z.string().email({message: 'Invalid email address'}),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: z.infer<typeof ForgotPasswordFormSchema>) {
    setLoading(true);
    const {error} = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/login/update-password`,
    });
    if (error) {
      setError(error.message);
    } else {
      setMessage(
        'If an account exists with that email, you will receive an email with a link to reset your password.',
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event == 'PASSWORD_RECOVERY') {
        return router.push('/login/update-password');
      }
    });
  }, []);

  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold mb-4">Password Recovery</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} type="email" />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-start space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="w-2 h-2 animate-spin" />
            ) : message ? (
              'Sent!'
            ) : (
              'Send password recovery email'
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
