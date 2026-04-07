import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white py-20 lg:py-32">
      <div className="max-w-container mx-auto px-4 text-center">
        <h1 className="text-h1 text-text-primary mb-4">
          Your AI Academic Companion
        </h1>
        <p className="text-lg text-text-secondary max-w-content mx-auto mb-8">
          From idea to submission in minutes\u2014not hours
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Get Started Free
          </Link>
          <Link href="#features" className="btn-secondary">
            See How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
