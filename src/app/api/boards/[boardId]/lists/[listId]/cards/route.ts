import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const cardSchema = z.object({
	title: z.string().min(1, 'Title required'),
	order: z.number(),
	description: z.string().optional(),
	color: z.string().optional(),
	archived: z.boolean().default(false),
});

type Props = {
	params: Promise<{
		boardId: string;
		listId: string;
	}>;
};

export async function GET(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId, listId } = await props.params;

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

		const cards = await prisma.card.findMany({
			where: {
				listId,
			},
			orderBy: {
				order: 'asc',
			},
		});
		return NextResponse.json(cards);
	} catch (error) {
		console.log('Failed to fetch cards', error);
		return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
	}
}

export async function POST(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId, listId } = await props.params;

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

		const body = await request.json();
		const validedData = cardSchema.parse(body);

		const newCard = await prisma.card.create({
			data: {
				...validedData,
				listId: listId,
			},
		});

		return NextResponse.json(newCard);
	} catch (error) {
		console.error('Failed to create card', error);
		return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
	}
}
