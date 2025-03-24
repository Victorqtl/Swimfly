import { useKanbanStore } from '@/store/useKanbanStore';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';
import { Trash } from 'lucide-react';

export default function BoardCards({ listId }: { listId: string }) {
	const { cards, boardId, updateCard, deleteCard } = useKanbanStore();

	return (
		<div>
			<ul className='space-y-2'>
				{cards
					.filter(card => card.listId === listId)
					.map((card, index) => (
						<li
							key={`${listId}-${card.id}-${index}`}
							className='flex items-center justify-between p-2 bg-neutral-100 rounded-lg group'>
							<div className='flex gap-2 items-center'>
								<input
									type='checkbox'
									checked={card.archived}
									onChange={() => {
										updateCard(boardId!, listId, card.id, {
											title: card.title,
											archived: !card.archived,
										});
									}}
									className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out checkbox checkbox-info checkbox-sm checked:opacity-100 checked:border-0 checked:bg-blue-400 text-white border-2 border-gray-700 rounded-full'
								/>
								<Link
									href='/'
									className={`w-full -translate-x-7 group-hover:translate-x-0 transition-transform ease-in-out duration-500 ${
										card.archived && 'translate-x-0'
									}`}>
									<h3
										className={`${
											card.archived && 'text-neutral-400'
										} transition-colors ease-in-out`}>
										{card.title}
									</h3>
								</Link>
							</div>
							<button onClick={() => deleteCard(boardId!, listId, card.id)}>
								<Trash size={16} />
							</button>
							<SquarePen
								size={16}
								className='opacity-0 group-hover:opacity-100'
							/>
						</li>
					))}
			</ul>
		</div>
	);
}
