import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateBoardSchema = z.object({
	title: z.string().min(1),
	color: z.string().optional(),
});

type Props = {
	params: Promise<{
		boardId: string;
	}>;
};

export async function GET(request: NextRequest, props: Props) {
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

		return NextResponse.json(board);
	} catch (error) {
		console.error('Failed to fetch board', error);
		return new NextResponse('Failed to fetch board', { status: 500 });
	}
}

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
		const validedData = updateBoardSchema.parse(body);

		const updatedBoard = await prisma.board.update({
			where: { id: boardId },
			data: {
				...validedData,
				updatedAt: new Date(),
			},
		});

		return NextResponse.json(updatedBoard);
	} catch (error) {
		console.error('Failed to update board', error);
		return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest, props: Props) {
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

		await prisma.board.delete({
			where: { id: boardId },
		});

		return NextResponse.json({ message: 'Board deleted successfully' });
	} catch (error) {
		console.error('Failed to delete board', error);
		return NextResponse.json({ error: 'Failed to delete board' }, { status: 500 });
	}
}
