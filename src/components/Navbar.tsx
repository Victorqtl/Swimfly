import Link from 'next/link';

export default function Navbar() {
	return (
		<div className='hover:shadow-md transition-shadow ease-in-out duration-400 border-b-2'>
			<div className='flex justify-between items-center p-4 lg:px-0 lg:w-[1320px] lg:mx-auto'>
				<Link
					className='text-4xl text-blue-500 font-bold'
					href='/'>
					Swimfly
				</Link>
				<Link
					href='/sign-in'
					className='text-md'>
					Sign In
				</Link>
			</div>
		</div>
	);
}
