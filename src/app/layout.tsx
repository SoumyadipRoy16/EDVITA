// src/app/layout.tsx

import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodeCraft | Internship Test Management Platform',
  description: 'Elevate your coding skills, ace internship challenges, and transform your career with our intelligent test management system.',
  keywords: ['internship', 'coding tests', 'tech recruitment', 'performance analytics', 'skill assessment'],
  openGraph: {
    title: 'CodeCraft: Your Gateway to Tech Internships',
    description: 'Transform your coding journey with data-driven skill assessment and challenge management.',
    images: [{ url: '/og-image.png' }]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-foreground`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
            <Footer />
            <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}