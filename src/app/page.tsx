"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { BackgroundLines } from "@/components/ui/background-lines"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlightColor?: string;
}

export default function Home() {
  const phrases = [
    "Streamlining Academic Success",
    "Empowering Educational Excellence",
    "Transforming Learning Journeys"
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const animateText = () => {
      const current = phrases[currentIndex];
      
      if (!isDeleting) {
        if (displayText.length < current.length) {
          timeout = setTimeout(() => {
            setDisplayText(current.slice(0, displayText.length + 1));
          }, 100);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayText(current.slice(0, displayText.length - 1));
          }, 50);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }
      }
    };

    timeout = setTimeout(animateText, 30);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative flex flex-col items-center justify-center">
      <BackgroundLines className="absolute inset-0 z-0" children={undefined}/>
      
      <main className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-16 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-primary mb-6 animate-text-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EDVITA: {displayText}<span className="animate-blink">|</span>
        </motion.h1>
        
        <motion.p 
          className="mt-3 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Transform your educational experience with our intelligent exam management and scheduling platform. Collaborate effectively, manage assessments, and enhance your academic journey.
        </motion.p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/register">
            <Button size="lg" className="text-lg group">
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}