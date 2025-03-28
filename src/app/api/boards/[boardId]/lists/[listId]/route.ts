import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateListSchema = z.object({
	title: z.string().min(1),
	order: z.number().optional(),
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

		const { listId, boardId } = await props.params;

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

		const validedData = updateListSchema.parse(body);

		const list = await prisma.list.update({
			where: {
				id: listId,
				boardId: boardId,
			},
			data: validedData,
		});

		return NextResponse.json(list);
	} catch (error) {
		console.error('Failed to update list', error);
		return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, props: Props) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { listId, boardId } = await props.params;

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

		await prisma.list.delete({
			where: {
				id: listId,
			},
		});

		await prisma.list.updateMany({
			where: {
				boardId: boardId,
				order: {
					gt: list.order,
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
		console.error('Failed to delete list', error);
		return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
	}
}
