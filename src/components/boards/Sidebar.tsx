'use client';

import { useKanbanStore } from '@/store/useKanbanStore';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface Session {
	user: {
		id: string;
		name: string;
		image: string;
	};
}

export default function Sidebar({ session }: { session: Session }) {
	const { setOpenBoardModal, boards, fetchBoards } = useKanbanStore();

	useEffect(() => {
		fetchBoards();
	}, [fetchBoards]);
	return (
		<nav className='min-h-[calc(100vh-88px)] min-w-60 bg-white rounded-br-lg border-[1px] border-t-0 border-gray-100 shadow-input shadow-lg hover:shadow-2xl transition-shadow ease-in-out duration-400'>
			<div className='flex flex-col p-4'>
				<div className='flex items-center gap-2 py-2 px-4 -mx-4 border-b-[1px] border-gray-100'>
					<Image
						src={session.user.image}
						alt='Profile picture'
						width={32}
						height={32}
						className='rounded-md'
					/>
					<h2>{session.user.name.split(' ')[0]}&apos;s Dashboard</h2>
				</div>
				<div>
					<div className='flex justify-between items-center'>
						<h3 className='font-bold'>Your boards</h3>
						<button
							onClick={() => setOpenBoardModal(true)}
							aria-label='Create a new board'
							className='-mx-2 p-2 text-xl font-bold cursor-pointer rounded-lg hover:bg-neutral-100'>
							<Plus
								size={16}
								strokeWidth={3}
							/>
						</button>
					</div>
					<div className='flex flex-col'>
						{boards.map(board => (
							<Link
								href={`/boards/${board.id}`}
								className='hover:bg-gray-100 py-2 px-4 -mx-4'
								key={board.id}>
								{board.title}
							</Link>
						))}
					</div>
				</div>
			</div>
		</nav>
	);
}
