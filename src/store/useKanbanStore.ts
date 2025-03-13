import { create } from 'zustand';

export interface Card {
	id: string;
	title: string;
	description: string;
	order: number;
	color?: string;
	dueDate?: Date;
	archived: boolean;
	listId: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface List {
	id: string;
	title: string;
	order: number;
	boardId: string;
	cards: Card[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Board {
	id: string;
	title: string;
	lists: List[];
	createdAt: Date;
	updatedAt: Date;
}

interface KanbanState {
	boards: Board[];
	lists: List[];
	openBoardModal: boolean;
	isLoading: boolean;
	currentBoard: Board | null;
	boardId: string | null;
	setBoardId: (id: string | null) => void;
	setOpenBoardModal: (open: boolean) => void;
	fetchBoards: () => Promise<void>;
	createBoard: (title: string) => Promise<Board>;
	getBoard: (boardId: string) => Promise<void>;
	updateBoardTitle: (boardId: string, title: string) => Promise<void>;
	deleteBoard: (boardId: string) => Promise<void>;
	fetchLists: (boardId: string) => Promise<void>;
	createList: (boardId: string, title: string) => Promise<List>;
	updateList: (listID: string, boardId: string, title: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
	boards: [],
	lists: [],
	openBoardModal: false,
	isLoading: false,
	currentBoard: null,
	boardId: null,

	setOpenBoardModal: open => set({ openBoardModal: open }),

	setBoardId: id => set({ boardId: id }),

	fetchBoards: async () => {
		set({ isLoading: true });
		try {
			const response = await fetch('/api/boards');
			if (!response.ok) {
				throw new Error('Error when fetching boards');
			}
			const boards = await response.json();
			set({ boards: boards, isLoading: false });
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	getBoard: async boardId => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}`);
			if (!response.ok) {
				throw new Error('Error when fetching board');
			}
			const board = await response.json();
			set({ currentBoard: board, isLoading: false });
			get().fetchLists(boardId);
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
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

			const board = await response.json();
			set(state => ({
				boards: [...state.boards, board],
				openModal: false,
				isLoading: false,
			}));
			await get().fetchBoards();
			return board;
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	updateBoardTitle: async (boardId, title) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			});

			if (!response.ok) {
				throw new Error('Error during board update');
			}

			const updatedBoard = await response.json();

			set(state => ({
				boards: state.boards.map(board => (board.id === boardId ? { ...board, title } : board)),
				currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard,
				isLoading: false,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	deleteBoard: async boardId => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Error during board deletion');
			}

			set(state => ({
				boards: state.boards.filter(board => board.id !== boardId),
				currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
				isLoading: false,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	fetchLists: async (boardId: string) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}/lists`);
			if (!response.ok) {
				throw new Error('Error when fetching lists');
			}
			const lists = await response.json();
			set({ lists: lists, isLoading: false });
			return lists;
		} catch (error) {
			console.error('Failed to fetch lists', error);
			set({ isLoading: false });
		}
	},

	createList: async (boardId, title) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}/lists`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			});

			if (!response.ok) {
				throw new Error('Error during list creation');
			}

			const list = await response.json();

			set(state => ({
				lists: [...state.lists, list],
				openModal: false,
				isLoading: false,
			}));

			return list;
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	updateList: async (listId, boardId, title) => {
		set({ isLoading: true });
		try {
			const list = get().lists.find(l => l.id === listId);
			if (!list) throw new Error('List not found');

			const response = await fetch(`/api/boards/${boardId}/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			});
			console.log(response);

			if (!response.ok) {
				throw new Error('Error during list update');
			}

			const updatedList = await response.json();

			set(state => ({
				lists: state.lists.map(l => (l.id === listId ? updatedList : l)),
				isLoading: false,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},
}));
