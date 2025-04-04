'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useKanbanStore } from '@/store/useKanbanStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const formSchema = z.object({
	title: z.string().min(1, {
		message: 'Title required',
	}),
	color: z.string().optional(),
});

export function CreateNewBoard() {
	const { createBoard, setOpenBoardModal, loadingState } = useKanbanStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			color: 'bg-white',
		},
	});
	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			const newBoard = await createBoard(values);
			if (!newBoard) {
				return;
			}
			setOpenBoardModal(false);
		} catch (error) {
			console.error('Error creating board:', error);
		}
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-4 w-72 p-4 relative bg-white rounded-lg'>
				<h2 className='text-base text-center'>Create a new board</h2>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Board title</FormLabel>
							<FormControl>
								<Input
									placeholder='First board'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='color'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Board wallpaper</FormLabel>
							<FormControl>
								<div className='flex flex-wrap gap-3 items-center justify-center'>
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
											onClick={() => field.onChange(color)}
											aria-label='Change color'
											className={`w-[40px] h-[25px] ${color} rounded-sm cursor-pointer border border-neutral-300 ${
												field.value === color ? 'border-0 ring-2 ring-neutral-300' : ''
											}`}
										/>
									))}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type='submit'
					variant='blue'
					disabled={loadingState.createBoard}
					aria-label='Create board'>
					{loadingState.createBoard ? (
						<span className='loading loading-spinner text-info'></span>
					) : (
						<span>Submit</span>
					)}
				</Button>
				<button
					type='button'
					onClick={() => setOpenBoardModal(false)}
					aria-label='Close form'
					className='absolute top-2 right-2 cursor-pointer text-xl'>
					<X
						size={20}
						strokeWidth={2}
					/>
				</button>
			</form>
		</Form>
	);
}
