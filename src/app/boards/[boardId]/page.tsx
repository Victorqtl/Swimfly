'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useKanbanStore } from '@/store/useKanbanStore';
import BoardHeader from '@/components/board/BoardHeader';
import { CreateNewBoard } from '@/components/boards/CreateNewBoard';
import CardModal from '@/components/board/Cards/CardModal';
import BoardLists from '@/components/board/Lists/BoardLists';
import NotFound from '@/app/not-found';

export default function BoardPage() {
	const params = useParams();
	const boardId = params.boardId as string;
	const {
		currentBoard,
		getBoard,
		openBoardModal,
		setOpenBoardModal,
		setBoardId,
		setOpenCardModal,
		openCardModal,
		loadingState,
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

	if (loadingState.board) {
		return (
			<div className='absolute top-1/2 left-1/2 translate-x-[20px] w-20 h-20 border-6 border-t-blue-400 border-b-blue-400 border-l-transparent border-r-transparent rounded-full animate-spin'></div>
		);
	}

	if (!currentBoard && !isInitialLoading) {
		return (
			<div>
				<NotFound />
			</div>
		);
	}

	return (
		<>
			{currentBoard && (
				<div className={`flex flex-col ${currentBoard.color}`}>
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
			)}
		</>
	);
}
