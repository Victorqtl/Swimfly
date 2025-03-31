import { useKanbanStore } from '@/store/useKanbanStore';
import { redirect } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Ellipsis, Trash } from 'lucide-react';

export default function BoardHeader() {
	const { currentBoard, updateBoard, deleteBoard, boardId } = useKanbanStore();
	const [showInputTitle, setShowInputTitle] = useState(false);
	const [localTitle, setLocalTitle] = useState(`${currentBoard!.title}`);
	const [toggleActionsList, setToggleActionsList] = useState(false);
	const actionsMenuRef = useRef<HTMLDivElement>(null);
	const ellipsisButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				(actionsMenuRef.current && actionsMenuRef.current.contains(event.target as Node)) ||
				(ellipsisButtonRef.current && ellipsisButtonRef.current.contains(event.target as Node))
			) {
				return null;
			}
			if (toggleActionsList) setToggleActionsList(false);
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [toggleActionsList]);

	const saveChanges = () => {
		if (localTitle.trim() !== '' && localTitle !== currentBoard!.title) {
			updateBoard(boardId!, { title: localTitle });
		}
		setShowInputTitle(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			saveChanges();
		} else if (e.key === 'Escape') {
			setShowInputTitle(false);
		}
	};

	return (
		<div className='flex items-center justify-between h-16 pl-2 pr-24 bg-neutral-700/20'>
			<div>
				{!showInputTitle ? (
					<h1
						className='px-2 py-1 text-2xl font-bold cursor-pointer hover:bg-neutral-700/15 rounded-lg transition-colors'
						onClick={() => setShowInputTitle(true)}>
						{currentBoard!.title}
					</h1>
				) : (
					<input
						autoFocus
						size={localTitle.length}
						type='text'
						value={localTitle}
						onChange={e => setLocalTitle(e.target.value)}
						onBlur={saveChanges}
						onKeyDown={handleKeyDown}
						className='px-2 py-1 text-2xl font-bold outline-blue-400 bg-gray-800 text-white rounded-xs'
					/>
				)}
			</div>
			<div className='relative'>
				<button
					ref={ellipsisButtonRef}
					onClick={() => setToggleActionsList(!toggleActionsList)}
					className='p-2 hover:bg-neutral-700/15 cursor-pointer rounded-lg'>
					<Ellipsis />
				</button>
				{toggleActionsList && (
					<div
						ref={actionsMenuRef}
						className='w-[282px] z-10 absolute -left-70 p-4 flex flex-col gap-2 border rounded-lg shadow-sm bg-white'>
						<h2 className='text-center font-semibold'>List of actions</h2>
						<ul className='space-y-4'>
							<li className='flex flex-wrap gap-3 items-center justify-center'>
								{[
									'bg-gradient-to-b from-green-200 to-green-400',
									'bg-gradient-to-b from-yellow-200 to-yellow-400',
									'bg-gradient-to-b from-red-200 to-red-400',
									'bg-gradient-to-b from-orange-200 to-orange-400',
									'bg-gradient-to-b from-purple-200 to-purple-400',
									'bg-gradient-to-b from-blue-200 to-blue-400',
									'bg-gradient-to-b from-cyan-200 to-cyan-400',
									'bg-gradient-to-b from-pink-200 to-pink-400',
									'bg-gradient-to-b from-gray-200 to-gray-400',
									'bg-white',
								].map(color => (
									<button
										key={color}
										type='button'
										onClick={() => updateBoard(boardId!, { title: localTitle, color: color })}
										className={`w-[40px] h-[25px] ${color} rounded-sm cursor-pointer border border-neutral-300 ${
											currentBoard!.color === color ? 'border-0 ring-2 ring-neutral-300' : ''
										}`}
									/>
								))}
							</li>
							<li className='hover:-mx-4'>
								<button
									onClick={() => {
										deleteBoard(boardId!);
										redirect('/boards');
									}}
									className='w-full py-2 flex justify-between items-center cursor-pointer hover:bg-red-200 hover:px-4'>
									<span>Delete board</span> <Trash size={16} />
								</button>
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
