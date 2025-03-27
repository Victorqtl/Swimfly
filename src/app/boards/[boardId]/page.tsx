'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useKanbanStore } from '@/store/useKanbanStore';
import BoardHeader from '@/components/board/BoardHeader';
import { CreateNewBoard } from '@/components/boards/CreateNewBoard';
import CardModal from '@/components/board/Cards/CardModal';
import BoardLists from '@/components/board/Lists/BoardLists';

export default function BoardPage() {
	const params = useParams();
	const boardId = params.boardId as string;
	const {
		currentBoard,
		isLoading,
		getBoard,
		openBoardModal,
		setOpenBoardModal,
		setBoardId,
		setOpenCardModal,
		openCardModal,
	} = useKanbanStore();
	const [isInitialLoading, setIsInitialLoading] = useState(true);

	useEffect(() => {
		const loadBoard = async () => {
			if (boardId) {
				setBoardId(boardId);
				await getBoard(boardId);
			}
			setIsInitialLoading(false);
		};

		loadBoard();
	}, [boardId, getBoard, setBoardId]);

	if (isLoading || isInitialLoading) {
		return (
			<div className='flex justify-center w-full mt-44'>
				<div className='flex flex-col items-center gap-2'>
					<div className='h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
					<p className='text-lg'>Loading board...</p>
				</div>
			</div>
		);
	}

	if (!currentBoard && !isInitialLoading) {
		return <div className='flex items-center justify-center h-full'>Board not found</div>;
	}

	return (
		<div className={`flex flex-col ${currentBoard!.color}`}>
			<BoardHeader />
			<div className='overflow-x-auto min-h-[calc(100vh-152px)]'>
				<BoardLists />
			</div>
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
			{openCardModal && (
				<div
					onClick={e => {
						if (e.target === e.currentTarget) {
							setOpenCardModal(false);
						}
					}}
					className='z-50 fixed left-0 top-0 right-0 bottom-0 flex justify-center items-center bg-black/30'>
					<CardModal />
				</div>
			)}
		</div>
	);
}
