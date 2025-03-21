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
		<div className='flex flex-1 overflow-hidden'>
			<div className='hidden md:block'>
				<Sidebar session={session} />
			</div>
			<div className='flex-1 overflow-x-auto'>{children}</div>
		</div>
	);
}
