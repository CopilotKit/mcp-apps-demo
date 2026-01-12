/**
 * Kanban board data layer for the Kanban Board demo.
 * Contains board/column/card types, templates, and CRUD operations.
 */
export type Priority = "low" | "medium" | "high";
export type BoardTemplate = "blank" | "software" | "marketing" | "personal";
export interface Card {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    tags: string[];
    dueDate?: string;
    createdAt: string;
}
export interface Column {
    id: string;
    name: string;
    color: string;
    cards: Card[];
}
export interface Board {
    id: string;
    name: string;
    columns: Column[];
}
export interface CardOperationResult {
    success: boolean;
    message: string;
    board?: Board;
    card?: Card;
}
export declare function createBoard(name: string, template?: BoardTemplate): Board;
export declare function getBoard(boardId: string): Board | undefined;
export declare function addCard(boardId: string, columnId: string, card: Omit<Card, "id" | "createdAt">): CardOperationResult;
export declare function updateCard(boardId: string, cardId: string, updates: Partial<Omit<Card, "id" | "createdAt">>): CardOperationResult;
export declare function deleteCard(boardId: string, cardId: string): CardOperationResult;
export declare function moveCard(boardId: string, cardId: string, targetColumnId: string, position?: number): CardOperationResult;
//# sourceMappingURL=kanban.d.ts.map