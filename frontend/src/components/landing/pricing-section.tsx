import Link from "next/link";

const pricingData = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: [
      "3 essays per month",
      "Basic AI models",
      "PDF export",
      "Email support",
    ],
    cta: "Get Started",
    variant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    features: [
      "Unlimited essays",
      "Premium AI models (GPT-4, Claude)",
      "All export formats",
      "Priority support",
      "Plagiarism checker",
    ],
    cta: "Start Free Trial",
    variant: "primary" as const,
    highlight: true,
  },
  {
    name: "Team",
    price: "$19.99",
    period: "/month",
    features: [
      "Everything in Pro",
      "Collaborative workspaces",
      "Team management",
      "API access",
      "Custom branding",
    ],
    cta: "Contact Sales",
    variant: "secondary" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-text-primary mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body text-text-secondary max-w-content mx-auto">
            Start free and upgrade as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pricingData.map((tier) => (
            <div
              key={tier.name}
              className={`card text-center ${
                tier.highlight
                  ? "border-2 border-primary shadow-md relative"
                  : ""
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-primary text-xs px-3 py-1">
                  Most Popular
                </span>
              )}
              <h3 className="text-h3 text-text-primary mb-2">{tier.name}</h3>
              <p className="mb-6">
                <span className="text-h1 text-text-primary">{tier.price}</span>
                <span className="text-text-secondary text-body-sm">{tier.period}</span>
              </p>
              <ul className="space-y-3 mb-6 text-left">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center text-body-sm text-text-primary">
                    <svg className="w-5 h-5 text-secondary mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={
                  tier.variant === "primary" ? "btn-primary w-full" : "btn-secondary w-full"
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
