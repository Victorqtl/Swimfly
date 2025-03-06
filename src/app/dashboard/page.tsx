import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BoardsList from '@/components/dashboard/BoardsList';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function page() {
	const session = await auth();
	console.log('Session:', session);

	if (!session) redirect('/sign-in');

	return (
		<div className='flex'>
			<Sidebar session={session} />
			<BoardsList />
		</div>
	);
}
