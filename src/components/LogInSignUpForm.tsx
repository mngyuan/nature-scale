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
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {useSearchParams} from 'next/navigation';
import {Eye, EyeClosed, LoaderCircle} from 'lucide-react';
import {useState} from 'react';
import Link from 'next/link';
import {AuthError} from '@supabase/supabase-js';
import {useUpdateStates} from '@/lib/hooks';

const LoginFormSchema = z.object({
  email: z.string().email({message: 'Invalid email address'}),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters'}),
});

const SignupFormSchema = z.object({
  firstName: z.string().min(1, {message: 'First name is required'}),
  lastName: z.string().min(1, {message: 'Last name is required'}),
  email: z.string().email({message: 'Invalid email address'}),
  password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters'}),
});

function LoginForm({
  loginAction,
}: {
  loginAction: (formData: FormData) => Promise<{error?: AuthError}>;
}) {
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    const {error} = await loginAction(formData);
    if (error) {
      setError(error.message);
    } else {
      // action handles redirect so no need here
      setMessage('Logging you in...');
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold mb-4">
        Log in to an existing account
      </h2>
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
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <Link
                href="/login/forgot-password"
                className="text-sm hover:underline text-muted-foreground"
              >
                Forgot your password?
              </Link>
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
              'Login'
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

function SignUpForm({
  signupAction,
}: {
  signupAction: (formData: FormData) => Promise<{error?: AuthError}>;
}) {
  const {loading, setLoading, error, setError, message, setMessage} =
    useUpdateStates();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    // Must be defined otherwise components will change from uncontrolled to controlled
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof SignupFormSchema>) {
    setLoading(true);
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    const {error} = await signupAction(formData);
    if (error) {
      setError(error.message);
    } else {
      // action handles redirect so no need here
      setMessage('Created a new account! Logging you in...');
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <h2 className="text-2xl font-semibold mb-4">Create a new account</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="flex flex-row items-center justify-between">
          <FormField
            control={form.control}
            name="firstName"
            render={({field}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <Input {...field} placeholder="John" />
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
        </div>
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
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              'Sign Up'
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

export default function LogInSignUpForm({
  loginAction,
  signupAction,
}: {
  loginAction: (formData: FormData) => Promise<{error?: AuthError}>;
  signupAction: (formData: FormData) => Promise<{error?: AuthError}>;
}) {
  const searchParams = useSearchParams();
  const show = searchParams.get('show');

  return (
    <Tabs
      defaultValue={show && ['login', 'signup'].includes(show) ? show : 'login'}
    >
      <TabsList className="mb-2">
        <TabsTrigger value="login" className="grow">
          Login
        </TabsTrigger>
        <TabsTrigger value="signup" className="grow">
          Sign Up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm loginAction={loginAction} />
      </TabsContent>
      <TabsContent value="signup">
        <SignUpForm signupAction={signupAction} />
      </TabsContent>
    </Tabs>
  );
}
