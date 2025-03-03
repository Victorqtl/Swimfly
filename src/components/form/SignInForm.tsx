'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import GoogleSignIn from '../GoogleSignIn';
import GithubSignIn from '../GithubSignIn';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const formSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 caracters'),
});

export function SignInForm() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');
	const errorCredentials = error === 'CredentialsSignin';
	const errorOAuth = error === 'OAuthAccountNotLinked';
	const errorConfiguration = error === 'Configuration';
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const signInData = await signIn('credentials', {
			email: values.email,
			password: values.password,
			redirectTo: '/dashboard',
		});
		console.log('SignIn response:', signInData);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder='mail@example.com'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Enter your password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{errorCredentials && <div className='text-xs text-red-500'>Incorrect email or password</div>}
				{errorOAuth && (
					<div className='text-xs text-red-500'>
						A connection error has occurred. This email address may be associated with another connection
						method.
					</div>
				)}
				{errorConfiguration && (
					<div className='text-xs text-red-500'>
						{' '}
						A connection error has occurred. This email address may be associated with another connection
						method.
					</div>
				)}

				<Button
					type='submit'
					variant={'blue'}>
					Sign in
				</Button>
			</form>
			<div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
				or
			</div>
			<div className='flex flex-col gap-2'>
				<GoogleSignIn>Sign in with Google</GoogleSignIn>
				<GithubSignIn>Sign in with GitHub</GithubSignIn>
			</div>
			<p className='text-center text-sm text-neutral-600 mt-4'>
				If you don&apos;t have an account, please&nbsp;
				<Link
					className='text-blue-500 hover:underline'
					href='/sign-up'>
					Sign up
				</Link>
			</p>
		</Form>
	);
}
