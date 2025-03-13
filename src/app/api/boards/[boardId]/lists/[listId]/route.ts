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
		console.log(listId, boardId);
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
