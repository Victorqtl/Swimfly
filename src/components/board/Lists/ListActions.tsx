import { useKanbanStore } from '@/store/useKanbanStore';
import { Trash2 } from 'lucide-react';

export default function ListActions({ listId }: { listId: string }) {
	const { deleteList, boardId } = useKanbanStore();

	return (
		<>
			<h2 className='text-center font-semibold'>List of actions</h2>
			<ul>
				<li className='py-2 hover:bg-gray-100 hover:-mx-4 hover:px-4 cursor-pointer'>
					<p>Add a card</p>
				</li>
				<li className='py-2 hover:bg-gray-100 hover:-mx-4 hover:px-4 cursor-pointer'>
					<p>Sort by...</p>
				</li>
				<li className='py-2 hover:bg-gray-100 hover:-mx-4 hover:px-4 cursor-pointer'>Change list color</li>
				<li
					onClick={() => deleteList(listId, boardId!)}
					className='flex justify-between items-center py-2 hover:bg-red-200 hover:-mx-4 hover:px-4 cursor-pointer'>
					<p>Delete list</p>
					<Trash2 size={16} />
				</li>
			</ul>
		</>
	);
}
