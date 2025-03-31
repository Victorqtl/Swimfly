import React from 'react';
import { useKanbanStore } from '@/store/useKanbanStore';
import { useState } from 'react';
import { AlignJustify, X, Palette, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CardModal() {
	const { cards, cardId, setOpenCardModal, updateCard, deleteCard, boardId, listId } = useKanbanStore();
	const [showInputDescription, setShowInputDescription] = useState<boolean>(false);
	const [showInputTitle, setShowInputTitle] = useState(false);
	const [localCardTitle, setLocalCardTitle] = useState('');
	const [localDescription, setlocalDescription] = useState<string>('');

	const saveChanges = (e: React.FormEvent, currentCardTitle: string) => {
		e.preventDefault();
		if (localCardTitle.trim() !== '' && currentCardTitle !== localCardTitle) {
			updateCard(boardId!, listId!, cardId!, { title: localCardTitle });
		}
		setShowInputTitle(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent, currentCardTitle: string) => {
		if (e.key === 'Enter') {
			console.log('ENTER');
			saveChanges(e, currentCardTitle);
		} else if (e.key === 'Escape') {
			console.log('ESCAPE');
			setShowInputTitle(false);
		}
	};

	return (
		<div className='w-[768px] h-fit bg-white rounded-lg p-6'>
			{cards
				.filter(card => card.id === cardId)
				.map(card => (
					<div
						key={card.id}
						className='flex flex-col gap-5'>
						{card.color ? <div className={`h-[100px] -m-6 mb-0 rounded-t-lg ${card.color}`}></div> : null}
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-1'>
								<input
									type='checkbox'
									checked={card.archived}
									onChange={() => {
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											archived: !card.archived,
										});
									}}
									className='checkbox checkbox-info checkbox-md checked:border-0 checked:bg-blue-400 text-white border-2 border-gray-700 rounded-full'
								/>
								{!showInputTitle ? (
									<h3
										onClick={() => {
											setShowInputTitle(true);
											setLocalCardTitle(card.title);
										}}
										className='px-1 py-1 text-xl cursor-pointer'>
										{card.title}
									</h3>
								) : (
									<input
										type='text'
										onChange={e => setLocalCardTitle(e.target.value)}
										onKeyDown={e => {
											handleKeyDown(e, card.title);
										}}
										onBlur={e => saveChanges(e, card.title)}
										value={localCardTitle}
										autoFocus
										size={localCardTitle.length}
										className='px-1 py-1 bg-gray-800 text-white outline-blue-400 rounded-xs text-xl'
									/>
								)}
								{card.archived && (
									<button
										onClick={() => {
											deleteCard(boardId!, listId!, cardId!);
											setOpenCardModal(false);
										}}
										className='cursor-pointer'>
										<Trash size={20} />
									</button>
								)}
							</div>
							<button
								onClick={() => {
									setOpenCardModal(false);
								}}
								className='cursor-pointer'>
								<X size={22} />
							</button>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-2'>
									<AlignJustify />
									<h4 className='py-1 text-xl'>Description</h4>
								</div>
								{card.description && (
									<Button
										onClick={() => setShowInputDescription(true)}
										className='bg-neutral-500'>
										Edit
									</Button>
								)}
							</div>
							<div>
								{!showInputDescription ? (
									!card.description ? (
										<button
											onClick={() => setShowInputDescription(true)}
											className='w-full px-2 pt-2 pb-7 text-left bg-neutral-100 cursor-pointer rounded-sm'>
											Add a description...
										</button>
									) : (
										<p
											onClick={() => {
												setShowInputDescription(true);
												setlocalDescription(`${card.description}`);
											}}
											className='cursor-pointer'>
											{card.description}
										</p>
									)
								) : (
									<form
										onSubmit={e => {
											e.preventDefault();
											updateCard(boardId!, listId!, cardId!, {
												title: card.title,
												description: localDescription,
											});
											setShowInputDescription(false);
										}}
										className='w-full flex flex-col gap-4'>
										<textarea
											autoFocus
											value={localDescription}
											onChange={e => setlocalDescription(e.target.value)}
											className='p-2 border-2 border-neutral-400 outline-none rounded-lg'
										/>
										<div className='flex gap-2 w-full'>
											<Button
												variant='blue'
												type='submit'
												className='w-full'>
												Save
											</Button>
											<Button
												onClick={() => setShowInputDescription(false)}
												className='w-full'>
												Cancel
											</Button>
										</div>
									</form>
								)}
							</div>
						</div>
						<div className='flex flex-col gap-4'>
							<div className='flex items-center gap-2'>
								<Palette />
								<h4 className='py-1 text-xl'>Card color</h4>
							</div>
							<div className='flex flex-wrap gap-4 items-center justify-center'>
								{[
									'bg-green-500',
									'bg-yellow-500',
									'bg-red-500',
									'bg-orange-500',
									'bg-purple-500',
									'bg-blue-500',
									'bg-cyan-500',
									'bg-pink-500',
									'bg-gray-500',
									'bg-black',
								].map(color => (
									<button
										key={color}
										onClick={() =>
											updateCard(boardId!, listId!, card.id, {
												title: card.title,
												color: color,
											})
										}
										className={`w-[50px] h-[32px] ${color} rounded-sm cursor-pointer hover:brightness-90 ${
											card.color === color ? 'ring-2 ring-offset-2 ring-blue-400' : ''
										}`}
									/>
								))}
								{card.color && (
									<button
										onClick={() =>
											updateCard(boardId!, listId!, card.id, {
												title: card.title,
												color: '',
											})
										}
										className='w-[50px] h-[32px] bg-white border border-gray-300 rounded-sm cursor-pointer flex items-center justify-center'
										title='Aucune couleur'>
										<X size={18} />
									</button>
								)}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
