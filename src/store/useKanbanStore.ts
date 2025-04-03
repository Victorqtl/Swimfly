import { create } from 'zustand';

export type Card = {
	id: string;
	title: string;
	description?: string;
	order: number;
	color?: string;
	archived: boolean;
	listId: string;
	createdAt: Date;
	updatedAt: Date;
};

export type List = {
	id: string;
	title: string;
	order: number;
	boardId: string;
	cards: Card[];
	createdAt: Date;
	updatedAt: Date;
};

export type Board = {
	id: string;
	title: string;
	color?: string;
	lists: List[];
	createdAt: Date;
	updatedAt: Date;
};

type KanbanState = {
	boards: Board[];
	lists: List[];
	cards: Card[];
	openBoardModal: boolean;
	openCardModal: boolean;
	isLoading: boolean;
	currentBoard: Board | null;
	boardId: string | null;
	listId: string | null;
	cardId: string | null;

	setBoardId: (id: string | null) => void;
	setListId: (id: string | null) => void;
	setCardId: (id: string | null) => void;
	setOpenBoardModal: (open: boolean) => void;
	setOpenCardModal: (open: boolean) => void;
	setLists: (lists: List[]) => void;

	fetchBoards: () => Promise<Board[]>;
	createBoard: (data: { title: string; color?: string }) => Promise<Board>;
	getBoard: (boardId: string) => Promise<void>;
	updateBoard: (boardId: string, data: { title: string; color?: string }) => Promise<void>;
	deleteBoard: (boardId: string) => Promise<void>;

	fetchLists: (boardId: string) => Promise<List[]>;
	createList: (boardId: string, data: { title: string }) => Promise<List>;
	updateList: (boardId: string, listId: string, data: { title: string; order?: number }) => Promise<void>;
	updateListsOrder: (boardId: string, listsWithNewOrder: { id: string; order: number }[]) => Promise<void>;
	deleteList: (listId: string, boardId: string) => Promise<void>;

	fetchCards: (boardId: string, listId: string) => Promise<Card[]>;
	createCard: (boardId: string, listId: string, data: { title: string }) => Promise<Card>;
	updateCard: (
		boardId: string,
		listId: string,
		cardId: string,
		data: { title: string; description?: string; color?: string; archived?: boolean; order?: number }
	) => Promise<void>;
	deleteCard: (boardId: string, listId: string, cardId: string) => Promise<void>;
};

export const useKanbanStore = create<KanbanState>((set, get) => ({
	boards: [],
	lists: [],
	cards: [],
	currentBoard: null,
	openBoardModal: false,
	openCardModal: false,
	isLoading: false,
	boardId: null,
	listId: null,
	cardId: null,

	setOpenBoardModal: open => set({ openBoardModal: open }),
	setOpenCardModal: open => set({ openCardModal: open }),

	setBoardId: id => set({ boardId: id }),
	setListId: id => set({ listId: id }),
	setCardId: id => set({ cardId: id }),
	setLists: lists => set({ lists }),

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

	createBoard: async data => {
		try {
			const response = await fetch('/api/boards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			console.log(response);
			if (!response.ok) {
				throw new Error('Error during board creation');
			}

			const board = await response.json();
			set(state => ({
				boards: [...state.boards, board],
				openBoardModal: false,
			}));
			return board;
		} catch (error) {
			console.error('Something went wrong:', error);
		}
	},

	updateBoard: async (boardId, data) => {
		try {
			const response = await fetch(`/api/boards/${boardId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});

			if (!response.ok) {
				throw new Error('Error during board update');
			}

			const updatedBoard = await response.json();

			get().fetchBoards();

			set(state => ({
				currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	deleteBoard: async boardId => {
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
			}));
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	fetchLists: async (boardId: string) => {
		// set({ isLoading: true });
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

	createList: async (boardId, data) => {
		try {
			const board = get().boards.find(board => board.id === boardId);
			if (!board) throw new Error('Board not found');

			const lists = get().lists.filter(list => list.boardId === boardId);
			const order = lists.length > 0 ? Math.max(...lists.map(list => list.order)) + 1 : 1;

			const response = await fetch(`/api/boards/${boardId}/lists`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, order }),
			});

			if (!response.ok) {
				throw new Error('Error during list creation');
			}

			const list = await response.json();

			set(state => ({
				lists: [...state.lists, list],
				openModal: false,
			}));

			return list;
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	updateList: async (boardId, listId, data) => {
		try {
			const list = get().lists.find(l => l.id === listId);
			if (!list) throw new Error('List not found');

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});

			if (!response.ok) {
				set(state => ({
					lists: state.lists.map(l => (l.id === listId ? list : l)),
				}));
				throw new Error('Error during list update');
			}

			const updatedList = await response.json();

			set(state => ({
				lists: state.lists.map(l => (l.id === listId ? updatedList : l)),
			}));

			get().fetchLists(boardId);

			return updatedList;
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	updateListsOrder: async (boardId, listsWithNewOrder) => {
		try {
			const response = await fetch(`/api/boards/${boardId}/lists/reorder`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ lists: listsWithNewOrder }),
			});

			if (!response.ok) {
				throw new Error('Error during lists reordering');
			}
		} catch (error) {
			console.error('Something went wrong', error);
			get().fetchLists(boardId);
		}
	},

	deleteList: async (boardId, listId) => {
		try {
			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'DELETE',
			});

			if (!response) {
				throw new Error('Error during list deletion');
			}

			set(state => ({
				lists: state.lists.filter(list => list.id !== listId),
			}));
			get().fetchLists(boardId);
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	fetchCards: async (boardId, listId) => {
		// set({ isLoading: true });
		try {
			const list = get().lists.find(list => list.id === listId);
			if (!list) throw new Error('List not found');

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`);

			if (!response.ok) {
				throw new Error('Error during cards fetching');
			}

			const cards = await response.json();

			set(state => ({
				cards: [...state.cards.filter(card => card.listId !== listId), ...cards],
				isLoading: false,
			}));

			return cards;
		} catch (error) {
			console.error('Failed to fetch cards', error);
			set({ isLoading: false });
		}
	},

	createCard: async (boardId, listId, data) => {
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

			set(state => ({
				cards: [...state.cards, newCard],
			}));

			return newCard;
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	updateCard: async (boardId, listId, cardId, data) => {
		try {
			const card = get().cards.find(card => card.id === cardId);
			if (!card) {
				throw new Error('Card not found');
			}

			const list = get().lists.find(list => list.id === card.listId);
			if (!list) {
				throw new Error('List not found');
			}
			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});
			if (!response.ok) {
				throw new Error('Error during card update');
			}

			const updatedCard = await response.json();

			set(state => ({
				cards: state.cards.map(c => (c.id === cardId ? updatedCard : c)),
			}));
		} catch (error) {
			console.log('Something went wrong', error);
		}
	},

	deleteCard: async (boardId, listId, cardId) => {
		try {
			const card = get().cards.find(card => card.id === cardId);
			if (!card) {
				throw new Error('Card not found');
			}

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Error during card deletion');
			}

			const deletedCard = get().cards.find(c => c.id === cardId);
			if (deletedCard) {
				set(state => ({
					cards: state.cards.filter(c => c.id !== cardId),
				}));
			}
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},
}));
