import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Phone/OTP',
      credentials: {
        phone: { label: "Phone Number", type: "text", placeholder: "e.g. 9876543210" },
        otp: { label: "OTP", type: "password", placeholder: "1234" }
      },
      async authorize(credentials) {
        // Mock authorization for MVP Phase 1
        // In production, this would verify an actual OTP sent via SMS
        if (credentials?.phone && credentials?.otp === "1234") {
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone }
          })
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "User " + credentials.phone.slice(-4),
                phone: credentials.phone,
                role: "CUSTOMER"
              }
            })
          }
          
          return { id: user.id, name: user.name, phone: user.phone, role: user.role }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role
        session.user.phone = token.phone
        session.user.id = token.id
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "complex-secret-local-dev",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
