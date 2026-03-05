export type Todo = {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  user: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTodo = Pick<Todo, "title" | "description">;

export type UpdateTodo = CreateTodo & { _id: string };
