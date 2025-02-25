'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import GoogleSignInButton from '../GoogleSignInButton';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

const formSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 caracters'),
});

export function SignInForm() {
	const searchParams = useSearchParams();
	const error = searchParams.get('error');
	// const router = useRouter();
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
			// redirect: true,
			callbackUrl: '/user',
		});
		console.log('SignIn response:', signInData);

		// if (signInData?.error) {
		// 	console.log('Error:', signInData.error);
		// 	toast('Oops', {
		// 		description: 'Incorrect email or password',
		// 		action: {
		// 			label: 'Undo',
		// 			onClick: () => console.log('Undo'),
		// 		},
		// 	});
		// } else {
		// 	router.refresh();
		// 	setTimeout(() => {
		// 		router.push('/user');
		// 	}, 100);
		// }
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
				{error && <div className='text-xs text-red-500'>Incorrect email or password</div>}

				<Button
					type='submit'
					variant={'blue'}>
					Sign in
				</Button>
			</form>
			<div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
				or
			</div>
			<GoogleSignInButton>Google</GoogleSignInButton>
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
