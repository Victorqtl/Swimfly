import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BoardsList from '@/components/boards/BoardsList';

export default async function page() {
	const session = await auth();

	if (!session) redirect('/sign-in');

	return (
		<>
			<BoardsList />
		</>
	);
}
