import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      name?: string
      role?: 'user' | 'admin'
      education?: string
      skills?: string
      resumeLink?: string
    }
  }
}