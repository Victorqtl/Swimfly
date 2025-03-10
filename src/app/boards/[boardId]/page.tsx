'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useKanbanStore } from '@/store/useKanbanStore';
import BoardHeader from '@/components/board/BoardHeader';

export default function BoardPage() {
	const params = useParams();
	const boardId = params.boardId as string;

	const { currentBoard, isLoading, getBoard } = useKanbanStore();

	useEffect(() => {
		if (boardId) {
			getBoard(boardId);
		}
	}, [boardId, getBoard]);

	if (isLoading) {
		return <div className='flex items-center justify-center h-full'>Loading...</div>;
	}

	if (!currentBoard) {
		return <div className='flex items-center justify-center h-full'>Board not found</div>;
	}

	return (
		<div className='flex-1 p-4'>
			<BoardHeader boardId={boardId} />
		</div>
	);
}
