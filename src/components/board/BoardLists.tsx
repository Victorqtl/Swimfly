import { useKanbanStore } from '@/store/useKanbanStore';
import AddList from './AddList';
import { useState, useRef, useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import { Plus } from 'lucide-react';
import ListActions from './ListActions';

export default function BoardList() {
	const { lists, boardId, updateList } = useKanbanStore();
	const [titleListId, setTitleListId] = useState<string | null>(null);
	const [localListTitle, setLocalListTitle] = useState<string>('');
	const [actionsListId, setActionsListId] = useState<string | null>(null);
	const [toggleActionsList, setToggleActionsList] = useState(false);
	const actionsRef = useRef<HTMLDivElement>(null);
	console.log(actionsListId);

	const resetActionsList = () => {
		setToggleActionsList(false);
		setActionsListId(null);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
				resetActionsList();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [toggleActionsList]);

	const handleEditStart = (list: { id: string; title: string }) => {
		setTitleListId(list.id);
		setLocalListTitle(list.title);
	};

	const saveChanges = (listId: string, currentListTitle: string) => {
		if (localListTitle.trim() !== '' && localListTitle !== currentListTitle) {
			updateList(listId, boardId!, localListTitle);
		}
		setTitleListId(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, listId: string, currentTitle: string) => {
		if (e.key === 'Enter') {
			saveChanges(listId, currentTitle);
		} else if (e.key === 'Escape') {
			setTitleListId(null);
		}
	};

	return (
		<div
			className='h-full flex gap-4 p-4 overflow-x-auto'
			onKeyDown={e => {
				if (e.key === 'Escape') {
					resetActionsList();
				}
			}}>
			{lists.map(list => (
				<div
					key={list.id}
					className='relative w-[272px] h-fit p-4 bg-gray-100 rounded-md shadow-sm shrink-0'>
					<div className='flex justify-between items-center'>
						{titleListId === list.id ? (
							<input
								type='text'
								value={localListTitle}
								onChange={e => setLocalListTitle(e.target.value)}
								autoFocus
								onFocus={e => e.target.select()}
								onBlur={() => saveChanges(list.id, list.title)}
								onKeyDown={e => handleKeyDown(e, list.id, list.title)}
								className='px-2 py-1 bg-gray-800 text-white rounded-xs outline-blue-400 w-full'
							/>
						) : (
							<h2
								onClick={() => handleEditStart(list)}
								className='text-sm cursor-pointer w-full'>
								{list.title}
							</h2>
						)}
						<button
							onClick={() => {
								if (actionsListId !== list.id) {
									setActionsListId(list.id);
									setToggleActionsList(true);
								} else {
									resetActionsList();
								}
							}}
							className='p-1 rounded-lg cursor-pointer hover:bg-gray-200'>
							<Ellipsis />
						</button>
					</div>

					<div className='flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-200'>
						<Plus size={16} />
						<p>Add a card</p>
					</div>

					{toggleActionsList && actionsListId === list.id ? (
						<section
							ref={actionsRef}
							className='z-10 absolute -right-[225px] top-14 w-[272px] p-4 flex flex-col gap-2 border rounded-lg shadow-sm bg-white'>
							<ListActions listId={list.id} />
						</section>
					) : null}
				</div>
			))}
			<AddList />
		</div>
	);
}
