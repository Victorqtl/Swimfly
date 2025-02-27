import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function page() {
	const session = await auth();
	console.log('Session:', session);

	if (!session) redirect('/sign-in');

	return (
		<div>
			<h1>Hello {session.user.name}</h1>
			<p>{session.user.email}</p>
			<Image
				src={session.user.image}
				alt='Profil picture'
				className='rounded-full'
				width={30}
				height={30}
			/>
		</div>
	);
}
