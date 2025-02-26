import Link from 'next/link';
import { auth } from '../lib/auth';
import { signOut } from '../lib/auth';

export default async function Navbar() {
	const session = await auth();

	return (
		<div className='hover:shadow-md transition-shadow ease-in-out duration-400 border-b-2'>
			<div className='flex justify-between items-center p-4 lg:px-0 lg:w-[1320px] lg:mx-auto'>
				<Link
					className='text-4xl text-blue-500 font-bold'
					href='/'>
					Swimfly
				</Link>

				{session?.user ? (
					<form
						action={async () => {
							'use server';
							await signOut({ redirectTo: '/sign-in' });
						}}>
						<button
							type='submit'
							className='px-3 py-1 text-md border rounded-lg cursor-pointer hover:bg-accent'>
							Sign out
						</button>
					</form>
				) : (
					<Link
						href='/sign-in'
						className='px-3 py-1 text-md border rounded-lg hover:bg-accent'>
						Sign in
					</Link>
				)}
			</div>
		</div>
	);
}
