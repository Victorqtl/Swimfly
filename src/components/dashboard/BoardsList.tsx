'use client';

import { useEffect } from 'react';
import { Button } from '../ui/button';
import { CreateNewBoard } from './CreateNewBoard';
import { useKanbanStore } from '@/store/useKanbanStore';

export default function BoardsList() {
	const { boards, fetchBoards, openModal, setOpenModal } = useKanbanStore();
	useEffect(() => {
		fetchBoards();
	}, [fetchBoards]);

	return (
		<div>
			<Button onClick={() => setOpenModal(true)}>Create a new board </Button>

			<div>
				{boards.map(board => (
					<h3 key={board.id}>{board.title}</h3>
				))}
			</div>
			{openModal && (
				<div className='fixed top-0 right-0 left-0 bottom-0 z-50 bg-black/30 flex justify-center items-center'>
					<CreateNewBoard />
				</div>
			)}
		</div>
	);
}
