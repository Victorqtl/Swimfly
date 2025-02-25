'use client';

import { signOut } from 'next-auth/react';

export default function SignOutNav() {
	return (
		<button
			onClick={() => signOut({ redirect: true, callbackUrl: `${window.location.origin}/sign-in` })}
			className='cursor-pointer'>
			Sign Out
		</button>
	);
}
