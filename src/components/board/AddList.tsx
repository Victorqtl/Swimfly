import { CreateNewList } from './CreateNewList';
import { Button } from '../ui/button';
import { useState } from 'react';

export default function AddList() {
	const [showAddList, setShowAddList] = useState(false);

	return (
		<div>
			{!showAddList ? (
				<Button
					onClick={() => setShowAddList(true)}
					variant='blue'
					className='h-10 min-w-[272px] flex items-center justify-center gap-2'>
					<span className='text-xl'>+</span>
					<span>Add a list</span>
				</Button>
			) : (
				<CreateNewList setShowAddList={setShowAddList} />
			)}
		</div>
	);
}
