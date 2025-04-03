import { useKanbanStore } from '@/store/useKanbanStore';
import AddList from './AddList';
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import ListItem from './ListItem';

export default function BoardList() {
	const { lists, boardId, setLists, updateListsOrder } = useKanbanStore();

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
		</ul>
	);
}
