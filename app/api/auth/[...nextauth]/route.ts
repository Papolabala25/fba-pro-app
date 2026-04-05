import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        // 🔐 USUARIO PRO (puedes cambiarlo después)
        const user = {
          id: "1",
          name: "Alain Pro",
          email: "admin@fba-pro.com",
          password: "123456"
        }

        if (
          credentials?.email === user.email &&
          credentials?.password === user.password
        ) {
          return user
        }

        return null
      }
    })
  ],

  pages: {
    signIn: "/login"
  },

  session: {
    strategy: "jwt"
  },

  secret: process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST }