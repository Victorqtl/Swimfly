'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useKanbanStore } from '@/store/useKanbanStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	title: z.string().min(1, {
		message: 'Title required',
	}),
});

export function CreateNewBoard() {
	const { createBoard, isLoading, setOpenModal } = useKanbanStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createBoard(values.title);
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
				<Button
					type='submit'
					variant='blue'
					disabled={isLoading}>
					Submit
				</Button>
				<button
					type='button'
					onClick={() => setOpenModal(false)}
					className='absolute top-2 right-4 cursor-pointer text-xl'>
					x
				</button>
			</form>
		</Form>
	);
}
