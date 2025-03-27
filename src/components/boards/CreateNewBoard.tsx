'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
	const { createBoard, isLoading, setOpenBoardModal } = useKanbanStore();
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			color: 'bg-white',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const newBoard = await createBoard(values);
		if (!newBoard) return;
		setOpenBoardModal(false);
		router.push(`/boards/${newBoard.id}`);
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
							<FormLabel>Board Wallpaper</FormLabel>
							<FormControl>
								<div className='flex flex-wrap gap-3 items-center justify-center'>
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
										'bg-white',
									].map(color => (
										<button
											key={color}
											type='button'
											onClick={() => field.onChange(color)}
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
					disabled={isLoading}>
					Submit
				</Button>
				<button
					type='button'
					onClick={() => setOpenBoardModal(false)}
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
