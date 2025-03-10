import { useKanbanStore } from '@/store/useKanbanStore';
import { useRef, useState } from 'react';

export default function BoardHeader({ boardId }: { boardId: string }) {
	const { currentBoard, updateBoardTitle, deleteBoard } = useKanbanStore();
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
			updateBoardTitle(boardId, localTitle);
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
		<div className='flex items-center justify-between p-2 mb-6 bg-blue-500/30'>
			<div>
				{!handleInput ? (
					<h1
						className='px-2 py-1 text-2xl font-bold cursor-pointer hover:bg-white/50 transition-colors'
						onClick={enableEditMode}>
						{currentBoard!.title}
					</h1>
				) : (
					<input
						ref={inputRef}
						className='px-2 py-1 text-2xl font-bold outline-none bg-gray-400'
						size={localTitle.length}
						type='text'
						value={localTitle}
						onChange={e => setLocalTitle(e.target.value)}
						onBlur={saveChanges}
						onKeyDown={handleKeyDown}
					/>
				)}
			</div>
			<button
				onClick={() => {
					if (confirm('Êtes-vous sûr de vouloir supprimer ce board?')) {
						deleteBoard(boardId);
						window.location.href = '/';
					}
				}}
				className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>
				Supprimer
			</button>
		</div>
	);
}
