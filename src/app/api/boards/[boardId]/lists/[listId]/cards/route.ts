import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const cardSchema = z.object({
	title: z.string().min(1, 'Title required'),
	description: z.string().optional(),
	order: z.number().int().nonnegative(),
	color: z.string().optional(),
	archived: z.boolean().default(false),
});

export async function POST(req: Request, { params }: { params: { boardId: string; listId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId, listId } = await params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const list = await prisma.list.findUnique({
			where: {
				id: listId,
				boardId: boardId,
			},
		});

		if (!list) {
			return NextResponse.json({ error: 'List not found' }, { status: 404 });
		}

		const body = await req.json();
		const validedData = cardSchema.parse(body);

		const card = await prisma.card.create({
			data: {
				...validedData,
				listId: listId,
			},
		});

		return NextResponse.json(card);
	} catch (error) {
		console.error('Failed to create card', error);
		return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
	}
}
