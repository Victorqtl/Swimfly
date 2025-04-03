import { useKanbanStore } from '@/store/useKanbanStore';
import { Trash2 } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

export default function ListActions({
	listId,
	setShowAddCard,
	setToggleActionsList,
}: {
	listId: string;
	setShowAddCard: Dispatch<SetStateAction<boolean>>;
	setToggleActionsList: Dispatch<SetStateAction<boolean>>;
}) {
	const { deleteList, setListId, boardId } = useKanbanStore();

	return (
		<>
			<h2 className='text-center font-semibold'>List of actions</h2>
			<ul>
				<li className='hover:bg-gray-100 hover:-mx-4 hover:px-4'>
					<button
						onClick={() => {
							setListId(listId);
							setShowAddCard(true);
							setToggleActionsList(false);
						}}
						className='w-full py-2 cursor-pointer text-left'>
						Add a card
					</button>
				</li>
				<li
					onClick={() => deleteList(boardId!, listId)}
					className='hover:-mx-4'>
					<button className='w-full flex justify-between items-center py-2 hover:bg-red-200 hover:px-4 cursor-pointer'>
						<p>Delete list</p>
						<Trash2 size={16} />
					</button>
				</li>
			</ul>
		</>
	);
}
