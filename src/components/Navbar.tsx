import Link from 'next/link';
import { auth } from '../lib/auth';
import { signOut } from '../lib/auth';
import { Gauge } from 'lucide-react';

export default async function Navbar() {
	const session = await auth();

	return (
		<div className='w-[90%] mx-auto mt-3 z-50 rounded-xl bg-white border-[1px] border-gray-100 shadow-input shadow-xs hover:shadow-md transition-shadow ease-in-out duration-400'>
			<div className='flex justify-between items-center p-4 '>
				<Link
					className='text-4xl text-blue-400 font-bold'
					href='/'>
					Swimfly
				</Link>

				<div className='flex items-center gap-6'>
					<Link
						href='/boards'
						className='flex items-center gap-1'>
						<Gauge width={20} />
						Dashboard
					</Link>
					<Link href=''>Features</Link>
					<Link href=''>Pricing</Link>
					<Link href=''>Help</Link>
				</div>

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
						Log in
					</Link>
				)}
			</div>
		</div>
	);
}
