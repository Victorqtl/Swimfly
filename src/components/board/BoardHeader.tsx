import { useKanbanStore } from '@/store/useKanbanStore';
import { redirect } from 'next/navigation';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';

export default function BoardHeader() {
	const { currentBoard, updateBoardTitle, deleteBoard, boardId } = useKanbanStore();
	const [handleInput, setHandleInput] = useState(false);
	const [localTitle, setLocalTitle] = useState(`${currentBoard!.title}`);
	const inputRef = useRef<HTMLInputElement>(null);

	const enableEditMode = () => {
		setHandleInput(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		}, 5);
	};

	const saveChanges = () => {
		if (localTitle.trim() !== '' && localTitle !== currentBoard!.title) {
			updateBoardTitle(boardId!, localTitle);
		}
		setHandleInput(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			saveChanges();
		} else if (e.key === 'Escape') {
			setHandleInput(false);
		}
	};

	return (
		<div className='flex items-center justify-between h-16 pl-2 pr-24 bg-gray-900/20'>
			<div>
				{!handleInput ? (
					<h1
						className='px-2 py-1 text-2xl font-bold cursor-pointer hover:bg-white/50 rounded-lg transition-colors'
						onClick={enableEditMode}>
						{currentBoard!.title}
					</h1>
				) : (
					<input
						ref={inputRef}
						className='px-2 py-1 text-2xl font-bold outline-none bg-gray-600 rounded-lg'
						size={localTitle.length}
						type='text'
						value={localTitle}
						onChange={e => setLocalTitle(e.target.value)}
						onBlur={saveChanges}
						onKeyDown={handleKeyDown}
					/>
				)}
			</div>
			<Button
				onClick={() => {
					deleteBoard(boardId!);
					redirect('/boards');
				}}
				variant='destructive'
				className='cursor-pointer'>
				Supprimer
			</Button>
		</div>
	);
}
