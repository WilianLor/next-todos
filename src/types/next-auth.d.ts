import type { User } from "@/database/models/user.model";

declare module "next-auth" {
  interface Session {
    user: User;
  }

  interface JWT {
    email: string;
  }
}
