export type Priority = "urgent" | "normal" | "later";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
}
