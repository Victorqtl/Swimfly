import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
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
		jwt({ token, user }) {
			if (user) {
				token.name = user.name;
			}
			return token;
		},
		session({ session, token }) {
			session.user.name = token.name;
			return session;
		},
	},
	providers: [
		Google,
		GitHub,
		Credentials({
			credentials: {
				email: {},
				password: {},
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
					name: existingUser.name,
					email: existingUser.email,
				};
			},
		}),
	],
});

// { clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }
