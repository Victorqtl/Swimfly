import { useKanbanStore } from '@/store/useKanbanStore';

export default function BoardCards({ listId }: { listId: string }) {
	const { cards } = useKanbanStore();
	return (
		<div>
			<ul>
				{cards
					.filter(card => card.listId === listId)
					.map(card => (
						<li key={card.id}>
							<h3>{card.title}</h3>
						</li>
					))}
			</ul>
		</div>
	);
}
