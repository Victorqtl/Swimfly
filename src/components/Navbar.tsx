import { auth } from '../lib/auth';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
	const session = await auth();

	return (
		<div className='w-[90%] mx-auto mt-3 z-50 rounded-xl bg-white border-[1px] border-gray-100 shadow-input shadow-xs hover:shadow-md transition-shadow ease-in-out duration-400'>
			<NavbarClient session={session} />
		</div>
	);
}
