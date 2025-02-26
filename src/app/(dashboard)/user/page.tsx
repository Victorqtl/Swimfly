import { auth } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function page() {
	const session = await auth();
	console.log('Session:', session);

	if (!session) redirect('/sign-in');
	return <div>Hello {session?.user.name}</div>;
}
