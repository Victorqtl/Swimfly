import { create } from 'zustand';

interface Board {
	id: string;
	title: string;
}

interface KanbanState {
	boards: Board[];
	openModal: boolean;
	isLoading: boolean;
	setOpenModal: (open: boolean) => void;
	fetchBoards: () => Promise<void>;
	createBoard: (title: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
	boards: [],
	openModal: false,
	isLoading: false,

	setOpenModal: open => set({ openModal: open }),

	fetchBoards: async () => {
		set({ isLoading: true });
		try {
			const response = await fetch('/api/boards');
			if (!response.ok) {
				throw new Error('Error when fetching boards');
			}
			const data = await response.json();
			set({ boards: data.boards, isLoading: false });
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	createBoard: async title => {
		set({ isLoading: true });
		try {
			const response = await fetch('/api/boards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			});

			if (!response.ok) {
				throw new Error('Error during board creation');
			}

			const data = await response.json();
			set(state => ({
				boards: [...state.boards, data.board],
				openModal: false,
				isLoading: false,
			}));
			await get().fetchBoards();
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},
}));
