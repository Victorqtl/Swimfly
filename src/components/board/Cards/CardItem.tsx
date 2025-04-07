import { useKanbanStore } from '@/store/useKanbanStore';
import { Card } from '@/store/useKanbanStore';
import { useSortable } from '@dnd-kit/sortable';
import { SquarePen } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';

type CardItemProps = {
	card: Card;
};

export default function CardItem(props: CardItemProps) {
	const { boardId, updateCard, setOpenCardModal, setCardId, setListId } = useKanbanStore();

	const { card } = props;
	const { id, title, listId, color, archived } = card;

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.7 : 1,
		zIndex: isDragging ? 1000 : 1,
		boxShadow: isDragging ? '0 5px 15px rgba(0,0,0,0.2)' : undefined,
	};

	return (
		<li
			key={`${id}`}
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className='flex flex-col p-2 bg-neutral-100 rounded-lg group'>
			{color ? <div className={`h-6 -m-2 mb-2 rounded-t-lg ${color}`}></div> : null}
			<div className='flex justify-between items-center'>
				<div className='w-full h-full flex gap-2 items-center'>
					<input
						type='checkbox'
						checked={archived}
						onChange={() => {
							updateCard(boardId!, listId, id, {
								title: title,
								archived: !archived,
							});
						}}
						className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out checkbox checkbox-info checkbox-sm checked:opacity-100 checked:border-0 checked:bg-blue-400 text-white border-2 border-gray-700 rounded-full'
					/>
					<h3
						onClick={() => {
							setOpenCardModal(true);
							setCardId(id);
							setListId(listId);
						}}
						className={`w-full -translate-x-7 group-hover:translate-x-0 transition-transform ease-in-out duration-500 ${
							archived && 'translate-x-0'
						} ${archived && 'text-neutral-400'} transition-colors ease-in-out cursor-pointer`}>
						{title}
					</h3>
				</div>
				<SquarePen
					size={16}
					className='opacity-0 group-hover:opacity-100 cursor-pointer'
					onClick={() => {
						setOpenCardModal(true);
						setCardId(id);
						setListId(listId);
					}}
				/>
			</div>
		</li>
	);
}
