import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			name: string;
			image: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		id: string;
		name: string;
		image: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		name: string;
		email: string;
		image: string;
	}
}
