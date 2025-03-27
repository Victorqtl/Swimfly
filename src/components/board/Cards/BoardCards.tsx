import { useKanbanStore } from '@/store/useKanbanStore';
import { SquarePen } from 'lucide-react';

export default function BoardCards({ listId }: { listId: string }) {
	const { cards, boardId, updateCard, setOpenCardModal, setCardId, setListId } = useKanbanStore();

	return (
		<div>
			<ul className='space-y-2'>
				{cards
					.filter(card => card.listId === listId)
					.map(card => (
						<li
							key={`${card.id}`}
							className='flex flex-col p-2 bg-neutral-100 rounded-lg group'>
							{card.color ? <div className={`h-6 -m-2 mb-2 rounded-t-lg ${card.color}`}></div> : null}
							<div className='flex justify-between items-center'>
								<div className='w-full h-full flex gap-2 items-center'>
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
									<h3
										onClick={() => {
											setOpenCardModal(true);
											setCardId(card.id);
											setListId(card.listId);
										}}
										className={`w-full -translate-x-7 group-hover:translate-x-0 transition-transform ease-in-out duration-500 ${
											card.archived && 'translate-x-0'
										} ${
											card.archived && 'text-neutral-400'
										} transition-colors ease-in-out cursor-pointer`}>
										{card.title}
									</h3>
								</div>
								<SquarePen
									size={16}
									className='opacity-0 group-hover:opacity-100 cursor-pointer'
									onClick={() => {
										setOpenCardModal(true);
										setCardId(card.id);
										setListId(card.listId);
									}}
								/>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}
