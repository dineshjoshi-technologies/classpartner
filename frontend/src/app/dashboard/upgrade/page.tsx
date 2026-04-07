"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UpgradePage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: ["3 essays per month", "Basic AI models", "PDF export", "Email support"],
      current: true,
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      features: ["Unlimited essays", "Premium AI models (GPT-4, Claude)", "All export formats", "Priority support", "Plagiarism checker"],
      current: false,
      highlight: true,
    },
    {
      name: "Team",
      price: "$19.99",
      period: "/month",
      features: ["Everything in Pro", "Collaborative workspaces", "Team management", "API access", "Custom branding"],
      current: false,
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-h2 text-text-primary mb-2">Upgrade Your Plan</h1>
        <p className="text-text-secondary mb-8">Unlock powerful features to supercharge your academic workflow</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`${
                plan.highlight
                  ? "border-primary shadow-md relative"
                  : "border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-caption px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-h3 text-text-primary mb-1">{plan.name}</h3>
                <div className="text-h1 text-text-primary">
                  {plan.price}
                  <span className="text-body-sm text-text-secondary">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-body-sm text-text-secondary">
                    <svg className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button variant="secondary" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : (
                <Link href="#" className="block">
                  <Button
                    variant={plan.highlight ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.name === "Team" ? "Contact Sales" : `Upgrade to ${plan.name}`}
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
