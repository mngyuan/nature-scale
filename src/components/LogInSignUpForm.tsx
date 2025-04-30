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
  loginAction: (formData: FormData) => Promise<void>;
}) {
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    loginAction(formData);
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
              <Input {...field} type="password" />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-start space-x-2">
          <Button formAction={loginAction}>Login</Button>
        </div>
      </form>
    </Form>
  );
}

function SignUpForm({
  signupAction,
}: {
  signupAction: (formData: FormData) => Promise<void>;
}) {
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

  function onSubmit(data: z.infer<typeof SignupFormSchema>) {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    signupAction(formData);
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
              <Input {...field} type="password" />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-start space-x-2">
          <Button formAction={signupAction}>Sign up</Button>
        </div>
      </form>
    </Form>
  );
}

export default function LogInSignUpForm({
  loginAction,
  signupAction,
}: {
  loginAction: (formData: FormData) => Promise<void>;
  signupAction: (formData: FormData) => Promise<void>;
}) {
  return (
    <Tabs defaultValue="login">
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
