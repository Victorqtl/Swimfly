'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Gauge, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Session } from 'next-auth';

type NavbarClientProps = {
	session: Session | null;
};

export default function NavbarClient({ session }: NavbarClientProps) {
	const [openMenu, setOpenMenu] = useState(false);
	console.log(openMenu);
	return (
		<div className='relative flex justify-between items-center p-4'>
			<Link
				className='text-4xl text-blue-400 font-bold'
				href='/'>
				Swimfly
			</Link>

			<div className='hidden md:flex md:items-center md:gap-6'>
				<Link
					href='/boards'
					className='flex items-center gap-1'>
					<Gauge width={20} />
					Dashboard
				</Link>
				<Link href='/features'>Features</Link>
				<Link href='/pricing'>Pricing</Link>
				<Link href='/help'>Help</Link>
			</div>

			{/* Menu mobile */}
			{openMenu && (
				<div className='absolute right-10 top-10 bg-white z-50 p-4 flex flex-col border-1 shadow-sm rounded-lg md:hidden'>
					<div className='flex flex-col gap-4'>
						<Link
							href='/features'
							className='text-md'
							onClick={() => setOpenMenu(false)}>
							Features
						</Link>
						<Link
							href='/pricing'
							className='text-md'
							onClick={() => setOpenMenu(false)}>
							Pricing
						</Link>
						<Link
							href='/help'
							className='text-md'
							onClick={() => setOpenMenu(false)}>
							Help
						</Link>
					</div>
				</div>
			)}

			<div className='md:hidden'>
				{!openMenu ? (
					<button onClick={() => setOpenMenu(!openMenu)}>
						<Menu />
					</button>
				) : (
					<button onClick={() => setOpenMenu(false)}>
						<X />
					</button>
				)}
			</div>

			{session?.user ? (
				<button
					onClick={() => signOut({ redirectTo: '/sign-in' })}
					className='px-3 py-1 text-md border rounded-lg cursor-pointer hover:bg-accent'>
					Sign out
				</button>
			) : (
				<Link
					href='/sign-in'
					className='hidden md:block px-3 py-1 text-md border rounded-lg hover:bg-accent'>
					Log in
				</Link>
			)}
		</div>
	);
}
