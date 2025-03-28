import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const listSchema = z.object({
	title: z.string().min(1, 'Title required'),
	order: z.number(),
});

type Props = {
	params: Promise<{
		boardId: string;
	}>;
};

export async function GET(request: NextRequest, props: Props) {
	try {
		const session = await auth();
		const { boardId } = await props.params;

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

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

		return NextResponse.json(board.lists);
	} catch (error) {
		console.error('Failed to fetch lists', error);
		return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
	}
}

export async function POST(request: NextRequest, props: Props) {
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
		const validedData = listSchema.parse(body);

		const newList = await prisma.list.create({
			data: {
				...validedData,
				boardId: boardId,
			},
		});

		return NextResponse.json(newList);
	} catch (error) {
		console.error('Failed to create list', error);
		return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
	}
}
