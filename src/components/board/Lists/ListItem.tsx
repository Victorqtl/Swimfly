import { List } from '@/store/useKanbanStore';
import { useKanbanStore } from '@/store/useKanbanStore';
import { useState, useRef, useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import { Plus } from 'lucide-react';
import ListActions from './ListActions';
import BoardCards from '../Cards/BoardCards';
import { CreateNewCard } from '../Cards/CreateNewCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ListItemProps = {
	list: List;
};

export default function ListItem(props: ListItemProps) {
	const { list } = props;
	const { id, title } = list;
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });

	const { boardId, updateList, setListId, listId } = useKanbanStore();
	const [localListTitle, setLocalListTitle] = useState<string>('');
	const [toggleActionsList, setToggleActionsList] = useState(false);
	const [showInputTitle, setShowInputTitle] = useState(false);
	const [showAddCard, setShowAddCard] = useState(false);
	const actionsRef = useRef<HTMLDivElement>(null);
	const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.7 : 1,
	};

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

	const handleEditStart = () => {
		setShowInputTitle(true);
		setListId(id);
		setLocalListTitle(title);
	};

	const saveChanges = (listId: string, currentListTitle: string, e: React.FormEvent) => {
		e.preventDefault();

		if (localListTitle.trim() !== '' && localListTitle !== currentListTitle) {
			updateList(boardId!, listId, { title: localListTitle });
		}
		setShowInputTitle(false);
		setListId(null);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, listId: string, currentTitle: string) => {
		if (e.key === 'Enter') {
			saveChanges(listId, currentTitle, e);
		} else if (e.key === 'Escape') {
			setShowInputTitle(false);
			setListId(null);
		}
	};

	return (
		<li
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onKeyDown={e => {
				if (e.key === 'Escape' && toggleActionsList) {
					setToggleActionsList(false);
					setListId(null);
				}
			}}
			className='flex flex-col gap-2 relative w-[272px] h-fit p-4 bg-neutral-200 rounded-lg shadow-sm shrink-0'>
			<div className='flex justify-between items-center relative'>
				{showInputTitle && listId === id ? (
					<input
						type='text'
						value={localListTitle}
						onChange={e => setLocalListTitle(e.target.value)}
						autoFocus
						onBlur={e => saveChanges(id, title, e)}
						onKeyDown={e => handleKeyDown(e, id, title)}
						className='px-2 py-1 bg-gray-800 text-white rounded-xs outline-blue-400 w-full'
					/>
				) : (
					<h2
						onClick={() => handleEditStart()}
						className='text-sm cursor-pointer w-full px-2'>
						{title}
					</h2>
				)}
				<button
					ref={id === listId ? ellipsisButtonRef : null}
					onClick={() => {
						if (listId === id) {
							setToggleActionsList(false);
							setListId(null);
						} else {
							setToggleActionsList(true);
							setListId(id);
						}
					}}
					className='p-1 rounded-lg cursor-pointer hover:bg-gray-100'>
					<Ellipsis />
				</button>
			</div>
			<BoardCards listId={id} />
			<div>
				{listId !== id || !showAddCard ? (
					<button
						onClick={() => {
							setListId(id);
							setShowAddCard(true);
						}}
						className='relative flex items-center gap-2 w-full p-2 rounded-lg cursor-pointer hover:bg-neutral-100'>
						<Plus size={16} />
						Add a card
					</button>
				) : (
					showAddCard && listId === id && <CreateNewCard setShowAddCard={setShowAddCard} />
				)}
			</div>
			{toggleActionsList && listId === id ? (
				<section
					ref={actionsRef}
					className='z-10 absolute -right-[225px] top-14 w-[272px] p-4 flex flex-col gap-2 border rounded-lg shadow-sm bg-white'>
					<ListActions
						listId={id}
						setShowAddCard={setShowAddCard}
						setToggleActionsList={setToggleActionsList}
					/>
				</section>
			) : null}
		</li>
	);
}
