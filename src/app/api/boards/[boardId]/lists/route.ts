import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
// import { z } from 'zod';

// const listSchema;

export async function GET(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const session = await auth();
		const { boardId } = await params;

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

export async function POST(req: Request, { params }: { params: { boardId: string } }) {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const { boardId } = await params;

		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
				userId: session.user.id,
			},
		});
		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const { title } = await req.json();
		if (!title) {
			return NextResponse.json({ error: 'Title required' }, { status: 400 });
		}

		const lastList = await prisma.list.findFirst({
			where: { boardId },
			orderBy: { order: 'desc' },
		});

		const newOrder = lastList ? lastList.order + 1 : 1;

		const newList = await prisma.list.create({
			data: {
				title,
				order: newOrder,
				boardId,
			},
		});

		await prisma.board.update({
			where: { id: boardId },
			data: { updatedAt: new Date() },
		});

		return NextResponse.json(newList);
	} catch (error) {
		console.error('Failed to create list', error);
		return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
	}
}
