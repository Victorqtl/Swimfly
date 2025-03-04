import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import * as z from 'zod';
import { auth } from '@/lib/auth';

const boardSchema = z.object({
	title: z.string().min(1, 'Title required'),
});

export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session || !session.user.id) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const body = await req.json();
		const { title } = boardSchema.parse(body);

		const newBoard = await prisma.board.create({
			data: {
				title,
				userId: session.user.id,
			},
		});

		return NextResponse.json({ board: newBoard }, { status: 201 });
	} catch (error) {
		console.error('Failed to create board', error);
		return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await auth();

		if (!session || !session.user) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const boards = await prisma.board.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json({ boards }, { status: 200 });
	} catch (error) {
		console.error('Failed to fetch data', error);
	}
}
