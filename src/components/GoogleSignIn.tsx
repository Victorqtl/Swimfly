import { signIn } from 'next-auth/react';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import GoogleIcon from '../assets/icons/google-icon.svg';

interface GoogleSignInProps {
	children: ReactNode;
}
export default function GoogleSignIn({ children }: GoogleSignInProps) {
	return (
		<Button
			onClick={() => signIn('google', { redirectTo: '/user' })}
			variant={'outline'}
			className='w-full'>
			<Image
				src={GoogleIcon}
				alt='Google icon'
				className='w-5'
			/>
			{children}
		</Button>
	);
}
