import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateCardSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	color: z.string().optional(),
	archived: z.boolean().optional(),
	order: z.number().optional(),
});

type Props = {
	params: Promise<{
		boardId: string;
		listId: string;
		cardId: string;
	}>;
};

export async function PATCH(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { cardId, listId, boardId } = await props.params;

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

		const card = await prisma.card.findUnique({
			where: {
				id: cardId,
				listId: listId,
			},
		});

		if (!card) {
			return NextResponse.json({ error: 'Card not found' }, { status: 404 });
		}
		const body = await request.json();
		const validedData = updateCardSchema.parse(body);

		const updatedCard = await prisma.card.update({
			where: {
				id: cardId,
				listId: listId,
			},
			data: validedData,
		});

		await prisma.board.update({
			where: { id: boardId },
			data: { updatedAt: new Date() },
		});

		return NextResponse.json(updatedCard);
	} catch (error) {
		console.error('Failed to update card', error);
		return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId, listId, cardId } = await props.params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 404 });
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

		const card = await prisma.card.findUnique({
			where: {
				id: cardId,
				listId: listId,
			},
		});

		if (!card) {
			return NextResponse.json({ error: 'Card not found' }, { status: 404 });
		}

		await prisma.card.delete({
			where: {
				id: cardId,
				listId: listId,
			},
		});

		await prisma.card.updateMany({
			where: {
				listId: listId,
				order: {
					gt: card.order,
				},
			},
			data: {
				order: {
					decrement: 1,
				},
			},
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Failed to delete card', error);
		return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
	}
}
