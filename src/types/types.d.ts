import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			name?: string;
		} & DefaultSession['user'];
	}

	interface User extends DefaultUser {
		name?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		name?: string;
	}
}
