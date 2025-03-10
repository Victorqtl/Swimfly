import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
	try {
		const session = await auth();
		const { title } = await req.json();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		if (!title) {
			return new NextResponse('Title required', { status: 400 });
		}

		const newBoard = await prisma.board.create({
			data: {
				title,
				userId: session.user.id,
			},
		});

		return NextResponse.json(newBoard);
	} catch (error) {
		console.error('Failed to create board', error);
		return NextResponse.json({ error: 'Failed to create board' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await auth();

		if (!session) {
			return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
		}

		const boards = await prisma.board.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		if (!boards) {
			return new NextResponse('Boards not found', { status: 404 });
		}

		return NextResponse.json(boards);
	} catch (error) {
		console.error('Failed to fetch data', error);
		return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
	}
}
