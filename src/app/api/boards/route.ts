import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const boardSchema = z.object({
	title: z.string().min(1, 'Title required'),
	color: z.string().optional(),
});

export async function POST(req: Request) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const body = await req.json();
		const validedData = boardSchema.parse(body);

		const newBoard = await prisma.board.create({
			data: {
				...validedData,
				userId: session.user.id,
			},
		});

		return NextResponse.json(newBoard);
	} catch (error) {
		console.error('Failed to create board', error);
		return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const boards = await prisma.board.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				updatedAt: 'desc',
			},
		});

		if (!boards) {
			return NextResponse.json({ error: 'Boards not found' }, { status: 404 });
		}

		return NextResponse.json(boards);
	} catch (error) {
		console.error('Failed to fetch boards', error);
		return NextResponse.json({ error: 'Failed to fetch boards' }, { status: 500 });
	}
}
