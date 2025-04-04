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

export function CreateNewList({ setShowAddList }: { setShowAddList: (show: boolean) => void }) {
	const { createList, boardId } = useKanbanStore();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (boardId) {
			setShowAddList(false);
			await createList(boardId, values);
		}
	}

	return (
		<Form {...form}>
			<form
				onBlur={() => setShowAddList(false)}
				onSubmit={form.handleSubmit(onSubmit)}
				className='flex flex-col gap-2 w-[272px] p-4 bg-neutral-200 rounded-lg shadow-sm'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder='List title'
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
						aria-label='Create a new list'
						className='flex-1'>
						Submit
					</Button>
				</div>
			</form>
		</Form>
	);
}
