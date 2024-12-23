// src/app/page.tsx

"use client"

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Code, BarChart2, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlightColor?: string;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <BackgroundBeamsWithCollision className="absolute inset-0 z-0" children={undefined} />
      <main className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-primary mb-6 animate-text-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          CodeCraft: Test Management Reimagined
        </motion.h1>
        
        <motion.p 
          className="mt-3 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Transform your internship journey with an intelligent, data-driven platform that turns coding challenges into career opportunities. Showcase your skills, overcome complex problems, and accelerate your professional growth.
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/register">
            <Button size="lg" className="text-lg group">
              Start Your Journey
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg">
              Explore Features
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Code className="w-12 h-12 text-primary" />}
            title="Advanced Coding Challenges"
            description="Tackle real-world problems designed by industry experts, pushing the boundaries of your coding skills and problem-solving abilities."
            highlightColor="from-blue-500 to-purple-600"
          />
          <FeatureCard
            icon={<BarChart2 className="w-12 h-12 text-primary" />}
            title="Intelligent Performance Analytics"
            description="Receive deep, actionable insights into your coding performance, with AI-powered recommendations for skill improvement."
            highlightColor="from-green-500 to-teal-600"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-primary" />}
            title="Competitive Benchmarking"
            description="Compare your skills against top performers, identify your strengths, and strategically develop areas for growth."
            highlightColor="from-pink-500 to-red-600"
          />
        </div>

        <div className="mt-16 w-full overflow-hidden">
          <h2 className="text-3xl font-bold mb-8 text-primary">Trusted by Industry Leaders</h2>
          <motion.div 
            className="flex items-center space-x-12 px-4"
            animate={{
              x: ['-100%', '0%'],
              transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          >
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center space-x-12">
                <Image src="https://media.licdn.com/dms/image/v2/D560BAQES977bWAfoIg/company-logo_200_200/company-logo_200_200/0/1721977526454/synexoo_logo?e=1741824000&v=beta&t=ksEdcx0-VIqwLM5SCHMTexxPl4dUXuaHtwXFJUlYrcQ" alt="Synexoo" width={120} height={40} className="grayscale hover:grayscale-0 transition-all" />
                <Image src="https://th.bing.com/th/id/OIP.D4XI2Rda44z6l59KWzRwWwHaEZ?w=626&h=372&rs=1&pid=ImgDetMain" alt="GeekForGeeks" width={120} height={40} className="grayscale hover:grayscale-0 transition-all" />
                <Image src="https://miro.medium.com/v2/resize:fit:1118/1*xwh3VrV-PAG89ROdLj6oXg.png" alt="Leetcode" width={120} height={40} className="grayscale hover:grayscale-0 transition-all" />
                <Image src="https://www.cntanglewood.com/wp-content/uploads/2023/05/TANGLEWOOD-2.png" alt="Code Ninjas" width={120} height={40} className="grayscale hover:grayscale-0 transition-all" />
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlightColor = "from-primary via-purple-500 to-pink-500" }: FeatureCardProps) {
  return (
    <motion.div 
      className="bg-card text-card-foreground p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border group"
      whileHover={{ 
        scale: 1.05,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary dark:group-hover:text-primary-foreground transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
        {description}
      </p>
      <div 
        className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"
        style={{
          background: `linear-gradient(to right, ${highlightColor})`
        }}
      />
    </motion.div>
  )
}