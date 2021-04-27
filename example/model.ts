export interface AppUser {
  id: string;
  name: string;
}

export interface TodoItem {
  id: number;
  caption: string;
  done: boolean;
}

export type TodoList = TodoItem[];