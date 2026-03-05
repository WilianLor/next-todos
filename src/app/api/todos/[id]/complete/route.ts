import { type NextRequest, NextResponse } from "next/server";
import { TodoModel } from "@/database/models/todo.model";
import { dbConnect } from "@/database/mongodb";
import { requireSession } from "@/utils/session.utils";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/todos/[id]/complete">,
) {
  const authStatus = await requireSession();

  if (!authStatus.logged) {
    return authStatus.response;
  }

  await dbConnect();

  const { id } = await ctx.params;

  const todo = await TodoModel.findOneAndUpdate(
    {
      _id: id,
      user: authStatus.session.user._id,
    },
    { completed: true },
  );

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}
