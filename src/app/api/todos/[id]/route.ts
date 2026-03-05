import { type NextRequest, NextResponse } from "next/server";
import { TodoModel, type UpdateTodo } from "@/database/models/todo.model";
import { dbConnect } from "@/database/mongodb";
import { requireSession } from "@/utils/session.utils";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const { id } = await ctx.params;

  const todo = await TodoModel.findOne({
    _id: id,
    user: authStatus.session.user._id,
  });

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const { id } = await ctx.params;

  const todo = await TodoModel.findOneAndDelete({
    _id: id,
    user: authStatus.session.user._id,
  });

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted" });
}

export async function PUT(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]">,
) {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const { id } = await ctx.params;

  const body: UpdateTodo = await _req.json();

  const todo = await TodoModel.findOneAndUpdate(
    {
      _id: id,
      user: authStatus.session.user._id,
    },
    body,
  );

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}
