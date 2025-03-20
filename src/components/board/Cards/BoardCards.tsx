import { useKanbanStore } from '@/store/useKanbanStore';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';

export default function BoardCards({ listId }: { listId: string }) {
	const { cards } = useKanbanStore();
	return (
		<div>
			<ul>
				{cards
					.filter(card => card.listId === listId)
					.map((card, index) => (
						<li
							key={`${listId}-${card.id}-${index}`}
							className='bg-neutral-100 rounded-lg group'>
							<div className='flex gap-2 items-center p-2'>
								<input
									type='checkbox'
									className='opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out checkbox checkbox-info checkbox-sm checked:border-0 checked:bg-blue-400 text-white border-2 border-gray-700 rounded-full'
								/>
								<Link
									href='/'
									className='w-full -translate-x-7 group-hover:translate-x-0 transition-transform ease-in-out duration-400 '>
									<h3>{card.title}</h3>
								</Link>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}
