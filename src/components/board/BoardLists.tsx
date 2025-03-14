import { useKanbanStore } from '@/store/useKanbanStore';
import AddList from './AddList';
import { useState } from 'react';
import { Ellipsis } from 'lucide-react';

export default function BoardList() {
	const { lists, boardId, updateList, deleteList } = useKanbanStore();
	const [localListId, setLocalListId] = useState<string | null>(null);
	const [localTitle, setLocalTitle] = useState('');

	const handleEditStart = (list: { id: string; title: string }) => {
		setLocalListId(list.id);
		setLocalTitle(list.title);
	};

	const saveChanges = (listId: string, currentListTitle: string) => {
		if (localTitle.trim() !== '' && localTitle !== currentListTitle) {
			updateList(listId, boardId!, localTitle);
		}
		setLocalListId(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, listId: string, currentTitle: string) => {
		if (e.key === 'Enter') {
			saveChanges(listId, currentTitle);
		} else if (e.key === 'Escape') {
			setLocalListId(null);
		}
	};

	return (
		<div className='flex gap-4 p-4 overflow-x-auto'>
			{lists.map(list => (
				<div
					key={list.id}
					className='w-[272px] h-fit p-4 bg-gray-100 rounded-md shadow-sm shrink-0'>
					<div className='flex justify-between items-center'>
						{localListId !== list.id ? (
							<h2
								onClick={() => handleEditStart(list)}
								className='text-sm cursor-pointer hover:bg-gray-200 px-2 py-1 rounded-lg w-full'>
								{list.title}
							</h2>
						) : (
							<input
								type='text'
								value={localTitle}
								onChange={e => setLocalTitle(e.target.value)}
								autoFocus
								onFocus={e => e.target.select()}
								onBlur={() => saveChanges(list.id, list.title)}
								onKeyDown={e => handleKeyDown(e, list.id, list.title)}
								className='px-2 py-1 outline-none bg-gray-800 text-white rounded-lg w-full'
							/>
						)}
						<button
							onClick={() => deleteList(list.id, boardId!)}
							className='p-1 rounded-lg cursor-pointer hover:bg-gray-200'>
							<Ellipsis />
						</button>
					</div>
					{/* <div className='p-2 flex flex-col gap-2'>
							{list.cards &&
								list.cards.map((card) => (
									<div
										key={card.id}
										className='bg-white p-2 rounded shadow-sm'>
										<h3>{card.title}</h3>
									</div>
								))}
						</div> */}
				</div>
			))}
			<AddList />
		</div>
	);
}
