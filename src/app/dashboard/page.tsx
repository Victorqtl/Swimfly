import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BoardsList from '@/components/dashboard/BoardsList';

export default async function page() {
	const session = await auth();
	console.log('Session:', session);

	if (!session) redirect('/sign-in');

	return (
		<div>
			<BoardsList />
		</div>
	);
}
