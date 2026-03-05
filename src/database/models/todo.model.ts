import mongoose, {
  type Document,
  type InferSchemaType,
  model,
  Schema,
  type SchemaTimestampsConfig,
} from "mongoose";

const todoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type Todo = InferSchemaType<typeof todoSchema> & Document;

export type CreateTodo = Pick<Todo, "title" | "description">;

export type UpdateTodo = Pick<Todo, "title" | "description">;

type TodoModel = Todo & SchemaTimestampsConfig;

export const TodoModel =
  (mongoose.models.Todo as mongoose.Model<TodoModel>) ??
  model<TodoModel>("Todo", todoSchema);
