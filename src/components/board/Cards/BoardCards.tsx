import { useKanbanStore } from '@/store/useKanbanStore';
import CardItem from './CardItem';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function BoardCards({ listId }: { listId: string }) {
	const { cards, boardId, setCards, updateCardsOrder } = useKanbanStore();

	const cardsInList = cards.filter(card => card.listId === listId);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const activeIndex = cardsInList.findIndex(card => card.id === active.id);
		const overIndex = cardsInList.findIndex(card => card.id === over.id);

		if (activeIndex !== -1 && overIndex !== -1) {
			const newCards = arrayMove(cardsInList, activeIndex, overIndex);

			const updatedCards = newCards.map((card, index) => ({
				...card,
				order: index + 1,
			}));

			const otherCards = cards.filter(card => card.listId !== listId);
			setCards([...otherCards, ...updatedCards]);

			if (listId) {
				updateCardsOrder(boardId!, listId, updatedCards);
			}
		}
	};

	return (
		<div
			className='w-full'
			onPointerDown={e => e.stopPropagation()}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}>
				<SortableContext
					items={cardsInList.map(card => card.id)}
					strategy={verticalListSortingStrategy}>
					<ul className='space-y-2'>
						{cardsInList.map(card => (
							<CardItem
								card={card}
								key={card.id}
							/>
						))}
					</ul>
				</SortableContext>
			</DndContext>
		</div>
	);
}
