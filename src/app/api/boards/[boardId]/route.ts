import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId } = params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
			include: {
				lists: {
					orderBy: {
						order: 'asc',
					},
					include: {
						cards: {
							orderBy: {
								order: 'asc',
							},
						},
					},
				},
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		return NextResponse.json(board);
	} catch (error) {
		console.error('Failed to fetch board', error);
		return new NextResponse('Failed to fetch board', { status: 500 });
	}
}

export async function PATCH(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { title } = await req.json();
		const boardId = params.boardId;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const updatedBoard = await prisma.board.update({
			where: { id: boardId },
			data: {
				title: title,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(updatedBoard);
	} catch (error) {
		console.error('Failed to update board', error);
		return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
	}
}

export async function DELETE(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const boardId = params.boardId;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		await prisma.board.delete({
			where: { id: boardId },
		});

		return NextResponse.json({ message: 'Board deleted successfully' });
	} catch (error) {
		console.error('Failed to delete board', error);
		return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
	}
}
