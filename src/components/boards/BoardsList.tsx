'use client';

import { useEffect } from 'react';
import { Button } from '../ui/button';
import { CreateNewBoard } from './CreateNewBoard';
import { useKanbanStore } from '@/store/useKanbanStore';
import Link from 'next/link';

export default function BoardsList() {
	const { boards, fetchBoards, openBoardModal, setOpenBoardModal } = useKanbanStore();
	console.log('Boards:', boards);

	useEffect(() => {
		fetchBoards();
	}, [fetchBoards]);

	return (
		<section className='flex-1 p-4'>
			<ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-4'>
				<Button
					onClick={() => setOpenBoardModal(true)}
					size='xl'
					className='bg-zinc-500 hover:bg-zinc-600'>
					Create a new board
				</Button>
				{boards && boards.length > 0
					? boards.map(board => (
							<li
								key={board.id}
								className='h-24 rounded-lg bg-blue-400 text-white hover:bg-blue-500'>
								<Link href={`/boards/${board.id}`}>
									<div className='h-full w-full p-2'>
										<p className='text-base'>{board.title}</p>
									</div>
								</Link>
							</li>
					  ))
					: null}
			</ul>

			{openBoardModal && (
				<div
					onClick={e => {
						if (e.target === e.currentTarget) {
							setOpenBoardModal(false);
						}
					}}
					className='fixed top-0 right-0 left-0 bottom-0 z-50 bg-black/30 flex justify-center items-center'>
					<CreateNewBoard />
				</div>
			)}
		</section>
	);
}
