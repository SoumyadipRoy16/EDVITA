import { Code, BarChart, Users } from 'lucide-react'

const features = [
  {
    icon: <Code size={48} />,
    title: 'Advanced Coding Tests',
    description:
      'Take on challenging coding problems in a professional-grade environment.',
  },
  {
    icon: <BarChart size={48} />,
    title: 'Performance Analytics',
    description:
      'Get detailed insights into your test performance and progress.',
  },
  {
    icon: <Users size={48} />,
    title: 'Peer Comparison',
    description:
      'See how you stack up against other applicants and identify areas for improvement.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Our Platform?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="text-blue-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}