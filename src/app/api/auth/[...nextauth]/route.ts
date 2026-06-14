import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Flatmate Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "e.g. Aisha" }
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        
        // Accept the dummy users
        const validUsers = ["Aisha", "Rohan", "Priya", "Meera", "Dev", "Sam"];
        const name = credentials.username.trim();
        
        const matched = validUsers.find(u => u.toLowerCase() === name.toLowerCase());
        
        if (matched) {
          return { id: matched, name: matched, email: `${matched.toLowerCase()}@example.com` };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // use our custom login page
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.name = token.name;
        // token.sub is the id returned by authorize
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

export { handler as GET, handler as POST };
