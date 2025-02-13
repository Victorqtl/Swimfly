import { ReactNode } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import GoogleIcon from '../assets/icons/google-icon.svg';

interface GoogleSignInButtonProps {
	children: ReactNode;
}
export default function GoogleSignInButton({ children }: GoogleSignInButtonProps) {
	const loginWithGoogle = () => console.log('login with google');

	return (
		<Button
			onClick={loginWithGoogle}
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
