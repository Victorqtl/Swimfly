import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

export default function GithubSignIn() {
	return (
		<Button
			onClick={() => signIn('github', { redirectTo: '/user' })}
			variant={'outline'}
			className='w-full'>
			<p>Sign in with Github</p>
		</Button>
	);
}
