'use client';

import { useEffect } from 'react';
import { Button } from '../ui/button';
import { CreateNewBoard } from './CreateNewBoard';
import { useKanbanStore } from '@/store/useKanbanStore';
import Link from 'next/link';

export default function BoardsList() {
	const { boards, fetchBoards, openModal, setOpenModal } = useKanbanStore();
	useEffect(() => {
		fetchBoards();
	}, [fetchBoards]);

	return (
		<section className='flex-1'>
			<ul className='grid grid-cols-4 my-6 mb-9 gap-x-4 gap-y-4'>
				<Button
					onClick={() => setOpenModal(true)}
					variant='default'
					size='xl'>
					Create a new board
				</Button>
				{boards.map(board => (
					<li
						key={board.id}
						className='h-24 rounded-lg bg-blue-400 text-white hover:bg-blue-500'>
						<Link href={`http://localhost:3000/boards/${board.id}`}>
							<div className='h-full w-full p-2'>
								<p className='text-base'>{board.title}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>

			{openModal && (
				<div className='fixed  top-0 right-0 left-0 bottom-0 z-50 bg-black/30 flex justify-center items-center'>
					<CreateNewBoard />
				</div>
			)}
		</section>
	);
}
