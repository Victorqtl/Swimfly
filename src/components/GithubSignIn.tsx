import GitHubIcon from '../assets/icons/github-icon.svg';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';
import { ReactNode } from 'react';
import Image from 'next/image';

interface GitHubIconProps {
	children: ReactNode;
}

export default function GithubSignIn({ children }: GitHubIconProps) {
	return (
		<Button
			onClick={() => signIn('github', { redirectTo: '/dashboard' })}
			variant={'outline'}
			className='w-full'>
			<Image
				src={GitHubIcon}
				alt='GitHub icon'
				className='w-5'
			/>
			{children}
		</Button>
	);
}
