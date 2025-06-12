'use client';

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
import {useState} from 'react';
import {Eye, EyeClosed, LoaderCircle} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useUpdateStates} from '@/lib/hooks';

const UpdatePasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters'}),
});

export default function UpdatePasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [showPassword, setShowPassword] = useState(false);
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const form = useForm<z.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof UpdatePasswordFormSchema>) {
    setLoading(true);
    const {error} = await supabase.auth.updateUser({password: data.password});
    if (error) {
      setError(error.message);
    } else {
      setMessage('Successfully changed your password! Redirecting...');
    }
    setLoading(false);
    // User should now have an active session
    router.push('/dashboard');
  }

  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold mb-4">Update your password</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <div className="flex flex-row gap-2 items-center">
                <Input {...field} type={showPassword ? 'text' : 'password'} />
                <Button
                  variant="outline"
                  size="icon"
                  className="p-1 cursor-pointer"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </Button>
              </div>
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
              'Update Password'
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
