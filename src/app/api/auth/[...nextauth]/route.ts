import NextAuth, { Session, AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { getServerSession } from "next-auth/next"
import connectDB from "@/lib/mongodb"
import type { UserFormData } from "@/types/registration"

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false
      
      const db = await connectDB()
      const existingUser = await db.collection('users').findOne({ email: user.email })
      
      if (!existingUser) {
        return false // Redirect to registration if user doesn't exist
      }
      
      // Update user with provider details
      await db.collection('users').updateOne(
        { email: user.email },
        {
          $set: {
            lastLogin: new Date(),
            [`${account?.provider}Id`]: user.id,
          }
        }
      )
      
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const db = await connectDB()
        const dbUser = await db.collection('users').findOne({ email: session.user.email })
        if (dbUser) {
          session.user.id = dbUser._id.toString()
          session.user.role = dbUser.role
          session.user.firstName = dbUser.firstName
          session.user.lastName = dbUser.lastName
          session.user.education = dbUser.education
          session.user.skills = dbUser.skills
          session.user.resumeLink = dbUser.resumeLink
          session.user.name = `${dbUser.firstName} ${dbUser.lastName}`
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Custom redirect logic based on user role
      if (url.startsWith(baseUrl)) {
        const db = await connectDB()
        const session = await getServerSession(authOptions)
        const user = await db.collection('users').findOne({ 
          email: session?.user?.email 
        })
        
        if (user?.role === 'admin') {
          return `${baseUrl}/admin/dashboard`
        }
        return `${baseUrl}/dashboard`
      }
      return baseUrl
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }