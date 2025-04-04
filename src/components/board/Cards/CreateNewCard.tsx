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

export function CreateNewCard({ setShowAddCard }: { setShowAddCard: (show: boolean) => void }) {
	const { createCard, boardId, listId, setListId } = useKanbanStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (boardId) {
			setShowAddCard(false);
			await createCard(boardId, listId!, values);
		}
	}

	return (
		<Form {...form}>
			<form
				onBlur={() => {
					setShowAddCard(false);
					setListId(null);
				}}
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-2 w-full'>
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
						aria-label='Create a new card'
						className='flex-1'>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
