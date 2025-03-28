import React from 'react';
import { useKanbanStore } from '@/store/useKanbanStore';
import { useState } from 'react';
import { AlignJustify, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CardModal() {
	const { cards, cardId, setOpenCardModal, updateCard, boardId, listId } = useKanbanStore();
	const [showInputDescription, setShowInputDescription] = useState<boolean>(false);

	const [localDescription, setlocalDescription] = useState<string>('');
	return (
		<div className='w-[768px] h-fit bg-white rounded-lg p-6'>
			{cards
				.filter(card => card.id === cardId)
				.map(card => (
					<div
						key={card.id}
						className='flex flex-col gap-6'>
						{card.color ? <div className={`h-[100px] -m-6 mb-0 rounded-t-lg ${card.color}`}></div> : null}
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
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
								<h3 className='text-xl'>{card.title}</h3>
							</div>
							<button
								onClick={() => {
									setOpenCardModal(false);
								}}
								className='cursor-pointer'>
								<X size={22} />
							</button>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<AlignJustify />
								<h4 className='text-xl'>Description</h4>
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
						<div className='flex flex-col gap-6'>
							<div className='flex items-center gap-2'>
								<Palette />
								<h4 className='text-xl'>Card color</h4>
							</div>
							<div className='flex gap-6 items-center mx-auto'>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-green-500',
										})
									}
									className='w-[50px] h-[32px] bg-green-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-yellow-500',
										})
									}
									className='w-[50px] h-[32px] bg-yellow-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-red-500',
										})
									}
									className='w-[50px] h-[32px] bg-red-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-orange-500',
										})
									}
									className='w-[50px] h-[32px] bg-orange-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-purple-500',
										})
									}
									className='w-[50px] h-[32px] bg-purple-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-blue-500',
										})
									}
									className='w-[50px] h-[32px] bg-blue-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-cyan-500',
										})
									}
									className='w-[50px] h-[32px] bg-cyan-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-pink-500',
										})
									}
									className='w-[50px] h-[32px] bg-pink-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-gray-500',
										})
									}
									className='w-[50px] h-[32px] bg-gray-500 rounded-sm cursor-pointer'></button>
								<button
									onClick={() =>
										updateCard(boardId!, listId!, card.id, {
											title: card.title,
											color: 'bg-black',
										})
									}
									className='w-[50px] h-[32px] bg-black rounded-sm cursor-pointer'></button>
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
