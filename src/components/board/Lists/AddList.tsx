import { CreateNewList } from '@/components/board/Lists/CreateNewList';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddList() {
	const [showAddList, setShowAddList] = useState(false);

	return (
		<div>
			{!showAddList ? (
				<Button
					onClick={() => setShowAddList(true)}
					variant='blue'
					aria-label='Add a list'
					className='h-10 min-w-[272px] flex items-center justify-center gap-2'>
					<span className='text-xl'>
						<Plus strokeWidth={3} />
					</span>
					<span>Add a list</span>
				</Button>
			) : (
				<CreateNewList setShowAddList={setShowAddList} />
			)}
		</div>
	);
}
