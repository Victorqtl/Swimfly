import { useKanbanStore } from '@/store/useKanbanStore';
import Link from 'next/link';
// import { SquarePen } from 'lucide-react';
import { useState } from 'react';

export default function BoardCards({ listId }: { listId: string }) {
	const [cardId, setCardId] = useState<string | null>(null);
	// const [isChecked, setIsChecked] = useState(false);
	const { cards } = useKanbanStore();
	return (
		<div>
			<ul className='space-y-2'>
				{cards
					.filter(card => card.listId === listId)
					.map((card, index) => (
						<li
							key={`${listId}-${card.id}-${index}`}
							className='bg-neutral-100 rounded-lg group'>
							<div className='flex gap-2 items-center p-2'>
								<input
									type='checkbox'
									checked={cardId === card.id}
									onChange={checked => {
										if (checked) {
											setCardId(card.id);
										} else {
											setCardId(null);
										}
									}}
									onClick={() => {
										setCardId(card.id);
									}}
									className='opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out checkbox checkbox-info checkbox-sm checked:opacity-100 checked:border-0 checked:bg-blue-400 text-white border-2 border-gray-700 rounded-full'
								/>
								<Link
									href='/'
									className={`w-full -translate-x-7 group-hover:translate-x-0 transition-transform ease-in-out duration-400 ${
										cardId === card.id ? 'translate-x-0' : null
									}`}>
									<h3>{card.title}</h3>
								</Link>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}
