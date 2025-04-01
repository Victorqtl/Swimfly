import Link from 'next/link';
// import BlueGradient from '../assets/blue-gradient.png';
import BlueGradient from '../assets/blue-gradient2.png';
import Image from 'next/image';

export default function page() {
	return (
		<section>
			<Image
				src={BlueGradient}
				alt='Blue gradient'
				className='absolute top-0 w-full h-screen'
			/>
			<div className='absolute top-[20%] left-[50%] -translate-x-[50%] flex flex-col gap-10'>
				<h1 className='text-8xl text-center'>
					Managing your <span className='text-blue-400 font-bold'>life</span> has never been{' '}
					<span className='text-blue-400 font-bold'>easier</span>
				</h1>
				<Link
					href='/sign-up'
					className='py-6 px-12 text-xl rounded-full bg-blue-400 text-white self-center cursor-pointer hover:bg-blue-500 transition-colors ease-in-out'>
					Boost your productivity
				</Link>
			</div>
		</section>
	);
}
