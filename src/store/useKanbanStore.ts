import { create } from 'zustand';

export interface Card {
	id: string;
	title: string;
	description?: string;
	order: number;
	color?: string;
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
	cards: Card[];
	openBoardModal: boolean;
	isLoading: boolean;
	currentBoard: Board | null;
	boardId: string | null;
	listId: string | null;

	setBoardId: (id: string | null) => void;
	setListId: (id: string | null) => void;
	setOpenBoardModal: (open: boolean) => void;

	fetchBoards: () => Promise<Board[]>;
	createBoard: (title: string) => Promise<Board>;
	getBoard: (boardId: string) => Promise<void>;
	updateBoardTitle: (boardId: string, title: string) => Promise<void>;
	deleteBoard: (boardId: string) => Promise<void>;

	fetchLists: (boardId: string) => Promise<List[]>;
	createList: (boardId: string, title: string) => Promise<List>;
	updateList: (listId: string, boardId: string, title: string) => Promise<void>;
	deleteList: (listId: string, boardId: string) => Promise<void>;

	fetchCards: (boardId: string, listId: string) => Promise<Card[]>;
	createCard: (boardId: string, listId: string, data: { title: string }) => Promise<Card>;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
	boards: [],
	lists: [],
	cards: [],
	currentBoard: null,
	openBoardModal: false,
	isLoading: false,
	boardId: null,
	listId: null,

	setOpenBoardModal: open => set({ openBoardModal: open }),

	setBoardId: id => set({ boardId: id }),
	setListId: id => set({ listId: id }),

	fetchBoards: async () => {
		set({ isLoading: true });
		try {
			const response = await fetch('/api/boards');
			if (!response.ok) {
				throw new Error('Error during boards fetching');
			}
			const boards = await response.json();
			set({ boards: boards, isLoading: false });
			return boards;
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
			get().fetchBoards();
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

			get().fetchBoards();

			set(state => ({
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
				throw new Error('Error during lists fetching');
			}
			const lists = await response.json();
			set({ lists: lists, isLoading: false });
			for (const list of lists) {
				get().fetchCards(boardId, list.id);
			}
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

			get().fetchBoards();

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

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title }),
			});

			if (!response.ok) {
				throw new Error('Error during list update');
			}

			const updatedList = await response.json();

			get().fetchBoards();

			set(state => ({
				lists: state.lists.map(l => (l.id === listId ? updatedList : l)),
				isLoading: false,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	deleteList: async (listId, boardId) => {
		set({ isLoading: true });
		try {
			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'DELETE',
			});

			if (!response) {
				throw new Error('Error during list deletion');
			}

			get().fetchBoards();

			set(state => ({
				lists: state.lists.filter(list => list.id !== listId),
				isLoading: false,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},

	fetchCards: async (boardId, listId) => {
		set({ isLoading: true });
		try {
			const list = get().lists.find(list => list.id === listId);
			if (!list) throw new Error('List not found');

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`);

			if (!response.ok) {
				throw new Error('Error during cards fetching');
			}

			const cards = await response.json();

			set(state => ({
				cards: [...state.cards, ...cards],
				isLoading: false,
			}));

			return cards;
		} catch (error) {
			console.error('Failed to fetch cards', error);
			set({ isLoading: false });
			return [];
		}
	},

	createCard: async (boardId, listId, data) => {
		set({ isLoading: true });
		try {
			const list = get().lists.find(list => list.id === listId);
			if (!list) throw new Error('List not found');

			const cards = get().cards.filter(card => card.listId === listId);
			const order = cards.length > 0 ? Math.max(...cards.map(card => card.order)) + 1 : 1;

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, order }),
			});

			if (!response.ok) {
				throw new Error('Error during card creation');
			}

			const newCard = await response.json();

			get().fetchBoards();

			set(state => ({
				cards: [...state.cards, newCard],
				isLoading: false,
			}));

			return newCard;
		} catch (error) {
			console.error('Something went wrong', error);
			set({ isLoading: false });
		}
	},
}));
