import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const reorderSchema = z.object({
	lists: z.array(
		z.object({
			id: z.string(),
			order: z.number(),
		})
	),
});

type Props = {
	params: Promise<{
		boardId: string;
	}>;
};

export async function PATCH(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId } = await props.params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const body = await request.json();
		const validatedData = reorderSchema.parse(body);

		await prisma.$transaction(
			validatedData.lists.map(list =>
				prisma.list.update({
					where: {
						id: list.id,
						boardId: boardId,
					},
					data: {
						order: list.order,
					},
				})
			)
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error('Failed to reorder lists', error);
		return NextResponse.json({ error: 'Failed to reorder lists' }, { status: 500 });
	}
}
