const testimonials = [
    {
      name: 'Alex Johnson',
      role: 'Former Intern, Now Software Engineer',
      content:
        'The Test Management System helped me showcase my skills and land my dream job. The platform is intuitive and the challenges are real-world relevant.',
    },
    {
      name: 'Samantha Lee',
      role: 'Current Intern',
      content:
        "I'm constantly improving my coding skills thanks to the detailed feedback and analytics provided by the system. It's an invaluable tool for aspiring developers.",
    },
  ]
  
  export default function Testimonials() {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }  