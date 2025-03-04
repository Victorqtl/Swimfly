'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { CreateNewBoard } from './CreateNewBoard';

interface Board {
	id: string;
	title: string;
}

export default function BoardsList() {
	const [openModal, setOpenModal] = useState(false);
	const [boards, setBoards] = useState<Board[]>([]);
	const fetchBoards = async () => {
		try {
			const response = await fetch('/api/boards');
			console.log('response:', response);
			if (!response.ok) {
				throw new Error('Error when fetching boards');
			}
			const data = await response.json();
			console.log('data:', data);
			setBoards(data.boards);
		} catch (error) {
			console.error('Something went wrong', error);
		}
	};

	useEffect(() => {
		fetchBoards();
	}, []);
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
					<CreateNewBoard setOpenModal={setOpenModal} />
				</div>
			)}
		</div>
	);
}
