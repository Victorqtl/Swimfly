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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z
	.object({
		name: z.string().min(1, 'Name is required').max(100),
		email: z.string().min(1, 'Email is required').email('Invalid email'),
		password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 caracters'),
		confirmPassword: z.string().min(1, 'Password confirmation is required'),
	})
	.refine(data => data.password === data.confirmPassword, {
		path: ['confirmPassword'],
		message: 'Password do not match',
	});

export function SignUpForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: values.name,
					email: values.email,
					password: values.password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();

				if (response.status === 409) {
					form.setError('email', {
						type: 'manual',
						message: errorData?.error,
					});
				} else {
					throw new Error('Error during user creation');
				}
			} else {
				toast('Congratulations', {
					description: 'Your account has been created',
				});
				router.push('/sign-in');
			}
		} catch (error) {
			console.error('Something went wrong:', error);
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder='John Doe'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm Password</FormLabel>
							<FormControl>
								<Input
									type='password'
									placeholder='Confirm your password'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Sign up</Button>
			</form>
			<div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
				or
			</div>
			<div className='flex flex-col gap-2'>
				<GoogleSignIn>Sign up with Google</GoogleSignIn>
				<GithubSignIn>Sign up with GitHub</GithubSignIn>
			</div>
			<p className='text-center text-sm text-neutral-600 mt-4'>
				If you already have an account , please&nbsp;
				<Link
					className='text-blue-500 hover:underline'
					href='/sign-in'>
					Sign in
				</Link>
			</p>
		</Form>
	);
}
