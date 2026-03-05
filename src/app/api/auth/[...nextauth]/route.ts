import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UserModel } from "@/database/models/user.model";
import { dbConnect } from "@/database/mongodb";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      await dbConnect();

      const existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        await UserModel.create({
          email: user.email as string,
          name: user.name as string,
          image: user.image as string,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) token.email = user.email;

      return token;
    },
    async session({ session, token }) {
      await dbConnect();

      const user = await UserModel.findOne({ email: token.email });

      if (user) {
        session.user = user;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
