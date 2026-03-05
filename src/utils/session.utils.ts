import { NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type RequireSessionResponse =
  | { logged: false; response: NextResponse }
  | { logged: true; session: Session };

export async function requireSession(): Promise<RequireSessionResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      logged: false,
      response: NextResponse.json(
        { error: "Não autorizado", message: "Faça login para acessar." },
        { status: 401 },
      ),
    };
  }

  return { logged: true, session };
}
