import { Button } from '../ui/button';
import { useKanbanStore } from '@/store/useKanbanStore';
import { CreateNewList } from './CreateNewList';
import { useEffect } from 'react';

export default function BoardList() {
	const { fetchLists, setOpenListModal, openListModal, boardId, lists } = useKanbanStore();

	useEffect(() => {
		if (boardId) {
			fetchLists(boardId);
		}
	}, [boardId, fetchLists]);

	return (
		<div className='p-4 overflow-x-auto'>
			<ul>
				{lists.map(list => (
					<li
						className='h-screen'
						key={list.id}>
						<div>
							<h2>{list.title}</h2>
						</div>
					</li>
				))}
			</ul>
			<Button
				onClick={() => setOpenListModal(true)}
				variant='blue'
				className='p-4 text-xl'>
				+
			</Button>
			{openListModal && (
				<div
					onClick={e => {
						if (e.target === e.currentTarget) {
							setOpenListModal(false);
						}
					}}
					className='fixed inset-0 z-50 bg-black/30 flex justify-center items-center'>
					<CreateNewList />
				</div>
			)}
		</div>
	);
}
