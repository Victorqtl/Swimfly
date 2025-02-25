import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function page() {
	const session = await auth();
	console.log('Session:', session);

	if (!session?.user)
		return (
			<div className='flex gap-4 items-center justify-center mt-8'>
				<p className='text-6xl'>Please</p>
				<Link
					href='/sign-in'
					className='text-6xl text-blue-500'>
					Sign In
				</Link>
			</div>
		);

	return <div>Hello {session?.user.username}</div>;
}
