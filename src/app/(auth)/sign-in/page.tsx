import { SignInForm } from '../../../components/form/SignInForm';
import { auth } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import AuthMobileGuard from '@/components/AuthMobileGuard';

export default async function page() {
	const session = await auth();

	if (session) redirect('/boards');

	return (
		<AuthMobileGuard>
			<div className='w-[425px] mt-8 mx-auto p-4 border-2 rounded-md '>
				<SignInForm />
			</div>
		</AuthMobileGuard>
	);
}
