import { useKanbanStore } from '@/store/useKanbanStore';
import AddList from './AddList';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import ListItem from './ListItem';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoardList() {
	const { lists, boardId, setLists, updateListsOrder, loadingState } = useKanbanStore();

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const activeIndex = lists.findIndex(list => list.id === active.id);
		const overIndex = lists.findIndex(list => list.id === over.id);

		if (activeIndex !== -1 && overIndex !== -1) {
			const newLists = arrayMove(lists, activeIndex, overIndex);

			const updatedLists = newLists.map((list, index) => ({
				...list,
				order: index + 1,
			}));

			const listsOrderUpdate = updatedLists.map(list => ({
				id: list.id,
				order: list.order,
			}));

			setLists(updatedLists);

			if (boardId) {
				updateListsOrder(boardId, listsOrderUpdate);
			}
		}
	};

	return (
		<ul className='flex gap-4 p-4'>
			{loadingState.cards ? (
				Array.from({ length: 2 }).map((_, index) => (
					<li
						key={`skeleton-${index}`}
						className='w-72 shrink-0 rounded-md bg-gray-100 dark:bg-gray-800 p-3'>
						<Skeleton className='h-6 w-32 mb-4' />
						<div className='space-y-3'>
							<Skeleton className='h-20 w-full' />
							<Skeleton className='h-20 w-full' />
						</div>
					</li>
				))
			) : (
				<>
					<DndContext
						sensors={sensors}
						onDragEnd={handleDragEnd}
						collisionDetection={closestCenter}>
						<SortableContext
							items={lists}
							strategy={horizontalListSortingStrategy}>
							{lists.map(list => (
								<ListItem
									list={list}
									key={list.id}
								/>
							))}
						</SortableContext>
					</DndContext>
					<AddList />
				</>
			)}
		</ul>
	);
}
