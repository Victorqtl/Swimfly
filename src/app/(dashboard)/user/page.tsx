import { auth } from '@/lib/auth';

export default async function UserAvatar() {
	const session = await auth();
	console.log(session);

	if (!session?.user) return null;

	return <div>Hello</div>;
}
