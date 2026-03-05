import { type NextRequest, NextResponse } from "next/server";
import { type CreateTodo, TodoModel } from "@/database/models/todo.model";
import { dbConnect } from "@/database/mongodb";
import { requireSession } from "@/utils/session.utils";

export async function GET() {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const todos = await TodoModel.find({ user: authStatus.session.user._id });

  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const body: CreateTodo = await req.json();

  const todo = await TodoModel.create({
    ...body,
    user: authStatus.session.user._id,
  });

  return NextResponse.json(todo);
}
