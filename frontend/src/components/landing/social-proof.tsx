const testimonials = [
  {
    name: "Sarah Chen",
    role: "Computer Science, Stanford",
    text: "ClassPartner helped me structure my thesis in half the time. The AI suggestions are incredibly relevant.",
  },
  {
    name: "Marcus Johnson",
    role: "Business, NYU",
    text: "As a non-native speaker, this tool has been invaluable for polishing my academic writing. Game-changer.",
  },
  {
    name: "Emily Rodriguez",
    role: "Psychology, UCLA",
    text: "The presentation export feature saved me hours. I used to struggle with formatting\u2014now it's done in minutes.",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-h2 text-primary font-bold mb-2">
            Used by 10,000+ students
          </p>
          <p className="text-text-secondary">
            Join thousands of students already learning smarter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="card">
              <p className="text-text-primary mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-primary text-caption font-bold">
                    {testimonial.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="text-body-sm font-medium text-text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
