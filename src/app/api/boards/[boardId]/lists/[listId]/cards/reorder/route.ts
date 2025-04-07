import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const reorderSchema = z.object({
	cards: z.array(
		z.object({
			id: z.string(),
			order: z.number(),
		})
	),
});

type Props = {
	params: Promise<{
		boardId: string;
		listId: string;
	}>;
};

export async function PATCH(request: NextRequest, props: Props) {
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
			},
		});

		if (!list) {
			return NextResponse.json({ error: 'List not found' }, { status: 404 });
		}

		const body = await request.json();
		const validatedData = reorderSchema.parse(body);

		await prisma.$transaction(
			validatedData.cards.map(card =>
				prisma.card.update({
					where: {
						id: card.id,
						listId: listId,
					},
					data: {
						order: card.order,
					},
				})
			)
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Failed to reorder cards', error);
		return NextResponse.json({ error: 'Failed to reorder cards' }, { status: 500 });
	}
}
