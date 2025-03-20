'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useKanbanStore } from '@/store/useKanbanStore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
	title: z.string().min(1, {
		message: 'Title required',
	}),
});

export function CreateNewCard({ setShowAddCardForm }: { setShowAddCardForm: (show: boolean) => void }) {
	const { createCard, isLoading, boardId, listId } = useKanbanStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (boardId) {
			await createCard(boardId, listId!, values.title);
			setShowAddCardForm(false);
		}
	}

	return (
		<Form {...form}>
			<form
				onBlur={() => setShowAddCardForm(false)}
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-2 w-full p-4 bg-gray-100 rounded-lg shadow-sm'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder='Card title'
									className='bg-white'
									autoFocus
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div
					className='flex gap-2'
					onMouseDown={e => e.preventDefault()}>
					<Button
						type='submit'
						variant='blue'
						disabled={isLoading}
						className='flex-1'>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
