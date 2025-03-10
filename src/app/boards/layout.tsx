import Sidebar from '@/components/boards/Sidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session) {
		redirect('/sign-in');
	}

	return (
		<div className='flex'>
			<Sidebar session={session} />
			{children}
		</div>
	);
}
