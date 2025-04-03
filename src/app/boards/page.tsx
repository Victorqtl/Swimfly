'use client';

import { useEffect, useState } from 'react';
import BoardsList from '@/components/boards/BoardsList';
import { useKanbanStore } from '@/store/useKanbanStore';

export default function BoardsPage() {
	const { fetchBoards, loadingState } = useKanbanStore();

	useEffect(() => {
		fetchBoards();
	}, []);

	return (
		<>
			{loadingState.boards ? (
				<div className='absolute top-1/2 left-1/2 translate-x-[20px] w-20 h-20 border-6 border-t-blue-400 border-b-blue-400 border-l-transparent border-r-transparent rounded-full animate-spin'></div>
			) : (
				<BoardsList />
			)}
		</>
	);
}
