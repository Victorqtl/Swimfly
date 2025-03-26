import { useKanbanStore } from '@/store/useKanbanStore';
import AddList from './AddList';
import { useState, useRef, useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import { Plus } from 'lucide-react';
import ListActions from './ListActions';
import BoardCards from '../Cards/BoardCards';
import { CreateNewCard } from '../Cards/CreateNewCard';

export default function BoardList() {
	const { lists, boardId, updateList, setListId, listId } = useKanbanStore();
	const [localListTitle, setLocalListTitle] = useState<string>('');
	const [toggleActionsList, setToggleActionsList] = useState(false);
	const [toggleInputTitle, setToggleInputTitle] = useState(false);
	const [showAddCard, setShowAddCard] = useState(false);
	const actionsRef = useRef<HTMLDivElement>(null);
	const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				(actionsRef.current && actionsRef.current.contains(event.target as Node)) ||
				(ellipsisButtonRef.current && ellipsisButtonRef.current.contains(event.target as Node))
			) {
				return;
			}
			if (toggleActionsList) {
				setToggleActionsList(false);
				setListId(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [toggleActionsList, setListId]);

	const handleEditStart = (list: { id: string; title: string }) => {
		setToggleInputTitle(true);
		setListId(list.id);
		setLocalListTitle(list.title);
	};

	const saveChanges = (listId: string, currentListTitle: string, e: React.FormEvent) => {
		e.preventDefault();

		if (localListTitle.trim() !== '' && localListTitle !== currentListTitle) {
			updateList(listId, boardId!, localListTitle);
		}
		setToggleInputTitle(false);
		setListId(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, listId: string, currentTitle: string) => {
		if (e.key === 'Enter') {
			saveChanges(listId, currentTitle, e);
		} else if (e.key === 'Escape') {
			setToggleInputTitle(false);
			setListId(null);
		}
	};

	return (
		<div
			className='flex gap-4 p-4'
			onKeyDown={e => {
				if (e.key === 'Escape' && toggleActionsList) {
					setToggleActionsList(false);
					setListId(null);
				}
			}}>
			{lists.map(list => (
				<div
					key={list.id}
					className='flex flex-col gap-2 relative w-[272px] h-fit p-4 bg-neutral-300 rounded-lg shadow-sm shrink-0'>
					<div className='flex justify-between items-center'>
						{toggleInputTitle && listId === list.id ? (
							<input
								type='text'
								value={localListTitle}
								onChange={e => setLocalListTitle(e.target.value)}
								autoFocus
								onFocus={e => e.target.select()}
								onBlur={e => saveChanges(list.id, list.title, e)}
								onKeyDown={e => handleKeyDown(e, list.id, list.title)}
								className='px-2 py-1 bg-gray-800 text-white rounded-xs outline-blue-400 w-full'
							/>
						) : (
							<h2
								onClick={() => handleEditStart(list)}
								className='text-sm cursor-pointer w-full px-2'>
								{list.title}
							</h2>
						)}
						<button
							ref={list.id === listId ? ellipsisButtonRef : null}
							onClick={() => {
								if (listId === list.id) {
									setToggleActionsList(false);
									setListId(null);
								} else {
									setToggleActionsList(true);
									setListId(list.id);
								}
							}}
							className='p-1 rounded-lg cursor-pointer hover:bg-gray-200'>
							<Ellipsis />
						</button>
					</div>

					<BoardCards listId={list.id} />

					<div>
						{listId !== list.id || !showAddCard ? (
							<button
								onClick={() => {
									setListId(list.id);
									setShowAddCard(true);
								}}
								className='flex items-center gap-2 w-full p-2 rounded-lg cursor-pointer hover:bg-neutral-100'>
								<Plus size={16} />
								Add a card
							</button>
						) : (
							showAddCard && listId === list.id && <CreateNewCard setShowAddCard={setShowAddCard} />
						)}
					</div>

					{toggleActionsList && listId === list.id ? (
						<section
							ref={actionsRef}
							className='z-10 absolute -right-[225px] top-14 w-[272px] p-4 flex flex-col gap-2 border rounded-lg shadow-sm bg-white'>
							<ListActions
								listId={list.id}
								setShowAddCard={setShowAddCard}
								setToggleActionsList={setToggleActionsList}
							/>
						</section>
					) : null}
				</div>
			))}
			<AddList />
		</div>
	);
}
