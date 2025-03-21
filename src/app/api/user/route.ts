import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100),
	email: z.string().min(1, 'Email is required').email('Invalid email'),
	password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 caracters'),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { name, email, password } = userSchema.parse(body);

		const existingUserByEmail = await prisma.user.findUnique({
			where: { email: email },
		});
		if (existingUserByEmail) {
			return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
		}

		const hashedPassword = await hash(password, 10);
		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
		// const { password: newUserPassword, ...rest } = newUser;
		const rest = { email, name };

		return NextResponse.json({ user: rest, message: 'User created sucessfully' }, { status: 201 });
	} catch (error) {
		console.error('Failed to create user', error);
		return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
	}
}
