import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import { prisma } from './prisma';

export const { signIn, signOut, auth, handlers } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/sign-in',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				return {
					...token,
					username: user.username,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					username: token.username as string,
				},
			};
		},
	},
	providers: [
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'mail@example.com' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const existingUser = await prisma.user.findUnique({ where: { email: credentials.email as string } });
				if (!existingUser) {
					return null;
				}

				const passwordMatch = await compare(credentials.password as string, existingUser.password);

				if (!passwordMatch) {
					return null;
				}
				return {
					id: `${existingUser.id}`,
					username: existingUser.username,
					email: existingUser.email,
				};
			},
		}),
	],
});
