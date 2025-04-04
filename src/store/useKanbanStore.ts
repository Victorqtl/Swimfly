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

type LoadingState = {
	boards: boolean;
	lists: boolean;
	cards: boolean;
	board: boolean;
	createBoard: boolean;
	updateCard: boolean;
};

type KanbanState = {
	boards: Board[];
	lists: List[];
	cards: Card[];
	openBoardModal: boolean;
	openCardModal: boolean;
	loadingState: LoadingState;
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
	loadingState: {
		boards: false,
		lists: false,
		cards: false,
		board: false,
		createBoard: false,
		updateCard: false,
	},
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
		set(state => ({ loadingState: { ...state.loadingState, boards: true } }));
		try {
			const response = await fetch('/api/boards');
			if (!response.ok) {
				throw new Error('Error during boards fetching');
			}
			const boards = await response.json();
			set(state => ({
				boards: boards,
				loadingState: { ...state.loadingState, boards: false },
			}));
			return boards;
		} catch (error) {
			console.error('Something went wrong', error);
			set(state => ({ loadingState: { ...state.loadingState, boards: false } }));
		}
	},

	getBoard: async boardId => {
		set(state => ({ loadingState: { ...state.loadingState, board: true } }));
		try {
			const response = await fetch(`/api/boards/${boardId}`);
			if (!response.ok) {
				throw new Error('Error when fetching board');
			}
			const board = await response.json();
			set(state => ({
				currentBoard: board,
				loadingState: { ...state.loadingState, board: false },
			}));
			get().fetchLists(boardId);
		} catch (error) {
			console.error('Something went wrong', error);
			set(state => ({ loadingState: { ...state.loadingState, board: false } }));
		}
	},

	createBoard: async data => {
		set(state => ({ loadingState: { ...state.loadingState, createBoard: true } }));
		try {
			const response = await fetch('/api/boards', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error('Error during board creation');
			}

			const board = await response.json();
			set(state => ({
				boards: [...state.boards, board],
				openBoardModal: false,
				loadingState: { ...state.loadingState, createBoard: false },
			}));
			return board;
		} catch (error) {
			console.error('Something went wrong:', error);
			set(state => ({ loadingState: { ...state.loadingState, createBoard: false } }));
		}
	},

	updateBoard: async (boardId, data) => {
		try {
			const board = get().boards.find(b => b.id === boardId);
			if (!board) throw new Error('Board not found');

			const optimisticBoard = { ...board, ...data };

			set(state => ({
				boards: state.boards.map(b => (b.id === boardId ? optimisticBoard : b)),
				currentBoard: state.currentBoard?.id === boardId ? optimisticBoard : state.currentBoard,
			}));

			const response = await fetch(`/api/boards/${boardId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});

			if (!response.ok) {
				set(state => ({
					boards: state.boards.map(b => (b.id === boardId ? board : b)),
					currentBoard: state.currentBoard?.id === boardId ? board : state.currentBoard,
				}));
				throw new Error('Error during board update');
			}

			const updatedBoard = await response.json();

			set(state => ({
				boards: state.boards.map(b => (b.id === boardId ? updatedBoard : b)),
				currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	deleteBoard: async boardId => {
		try {
			const board = get().boards.find(b => b.id === boardId);
			if (!board) throw new Error('Board not found');

			const response = await fetch(`/api/boards/${boardId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				throw new Error('Error during board deletion');
			}

			set(state => ({
				boards: state.boards.filter(b => b.id !== boardId),
				currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
			}));
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	fetchLists: async (boardId: string) => {
		set(state => ({ loadingState: { ...state.loadingState, lists: true } }));
		try {
			const response = await fetch(`/api/boards/${boardId}/lists`);
			if (!response.ok) {
				throw new Error('Error during lists fetching');
			}
			const lists = await response.json();
			set(state => ({
				lists: lists,
				loadingState: { ...state.loadingState, lists: false },
			}));
			for (const list of lists) {
				get().fetchCards(boardId, list.id);
			}
			return lists;
		} catch (error) {
			console.error('Failed to fetch lists', error);
			set(state => ({ loadingState: { ...state.loadingState, lists: false } }));
		}
	},

	createList: async (boardId, data) => {
		try {
			const board = get().boards.find(board => board.id === boardId);
			if (!board) throw new Error('Board not found');

			const lists = get().lists.filter(list => list.boardId === boardId);
			const order = lists.length > 0 ? Math.max(...lists.map(list => list.order)) + 1 : 1;

			const tempId = `temp-${Date.now()}`;
			const optimisticList: List = {
				id: tempId,
				title: data.title,
				order,
				boardId,
				cards: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			set(state => ({
				lists: [...state.lists, optimisticList],
			}));

			const response = await fetch(`/api/boards/${boardId}/lists`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, order }),
			});

			if (!response.ok) {
				set(state => ({
					lists: state.lists.filter(l => l.id !== tempId),
				}));
				throw new Error('Error during list creation');
			}

			const serverList = await response.json();

			set(state => ({
				lists: state.lists.map(l => (l.id === tempId ? serverList : l)),
			}));

			return serverList;
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	updateList: async (boardId, listId, data) => {
		try {
			const list = get().lists.find(l => l.id === listId);
			if (!list) throw new Error('List not found');

			const optimisticList = { ...list, ...data };

			set(state => ({
				lists: state.lists.map(l => (l.id === listId ? optimisticList : l)),
			}));

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});

			if (!response.ok) {
				set(state => ({
					lists: state.lists.map(l => (l.id === listId ? list : l)),
					loadingState: { ...state.loadingState, updateList: false },
				}));
				throw new Error('Error during list update');
			}

			const updatedList = await response.json();

			set(state => ({
				lists: state.lists.map(l => (l.id === listId ? updatedList : l)),
			}));

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
			const list = get().lists.find(list => list.id === listId);
			if (!list) {
				throw new Error('List not found');
			}

			set(state => ({
				lists: state.lists.filter(l => l.id !== listId),
			}));

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}`, {
				method: 'DELETE',
			});

			if (!response) {
				set(state => ({
					lists: [...state.lists, list],
				}));
				throw new Error('Error during list deletion');
			}
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},

	fetchCards: async (boardId, listId) => {
		set(state => ({ loadingState: { ...state.loadingState, cards: true } }));
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
				loadingState: { ...state.loadingState, cards: false },
			}));

			return cards;
		} catch (error) {
			console.error('Failed to fetch cards', error);
			set(state => ({ loadingState: { ...state.loadingState, cards: false } }));
		}
	},

	createCard: async (boardId, listId, data) => {
		try {
			const list = get().lists.find(list => list.id === listId);
			if (!list) throw new Error('List not found');

			const cards = get().cards.filter(card => card.listId === listId);
			const order = cards.length > 0 ? Math.max(...cards.map(card => card.order)) + 1 : 1;

			const tempId = `temp-${Date.now()}`;
			const optimisticCard: Card = {
				id: tempId,
				title: data.title,
				order,
				listId,
				archived: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			set(state => ({
				cards: [...state.cards, optimisticCard],
			}));

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data, order }),
			});

			if (!response.ok) {
				set(state => ({
					cards: state.cards.filter(c => c.id !== tempId),
				}));
				throw new Error('Error during card creation');
			}

			const serverCard = await response.json();

			set(state => ({
				cards: state.cards.map(c => (c.id === tempId ? serverCard : c)),
			}));

			return serverCard;
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

			const optimisticCard = { ...card, ...data };
			set(state => ({
				cards: state.cards.map(c => (c.id === cardId ? optimisticCard : c)),
			}));

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...data }),
			});
			if (!response.ok) {
				set(state => ({
					cards: state.cards.map(c => (c.id === cardId ? card : c)),
				}));
				throw new Error('Error during card update');
			}

			const updatedCard = await response.json();

			set(state => ({
				cards: state.cards.map(c => (c.id === cardId ? updatedCard : c)),
				loadingState: { ...state.loadingState, updateCard: false },
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

			set(state => ({
				cards: state.cards.filter(c => c.id !== cardId),
			}));

			const response = await fetch(`/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				set(state => ({
					cards: [...state.cards, card],
				}));
				throw new Error('Error during card deletion');
			}
		} catch (error) {
			console.error('Something went wrong', error);
		}
	},
}));
