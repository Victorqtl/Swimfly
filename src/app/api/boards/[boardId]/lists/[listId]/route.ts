import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { listId: string; boardId: string } }) {
	try {
		const session = await auth();
		const { title } = await req.json();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		if (!title) {
			return NextResponse.json({ error: 'Title required' }, { status: 400 });
		}
		const { listId, boardId } = params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const list = await prisma.list.update({
			where: {
				id: listId,
				boardId: boardId,
			},
			data: {
				title,
			},
		});
		return NextResponse.json(list);
	} catch (error) {
		console.error('Failed to update list', error);
		return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: { listId: string; boardId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { listId, boardId } = params;

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
