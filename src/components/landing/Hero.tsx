import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Jumpstart Your Tech Career
      </h1>
      <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
        Join our internship program and showcase your skills through our
        advanced Test Management System.
      </p>
      <div className="space-x-4">
        <Link
          href="/register"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Register Now
        </Link>
        <Link
          href="#features"
          className="text-blue-600 px-6 py-3 rounded-md border border-blue-600 hover:bg-blue-50 transition duration-300"
        >
          Learn More <ArrowRight className="inline-block ml-2" size={20} />
        </Link>
      </div>
    </section>
  )
}