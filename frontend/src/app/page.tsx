import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { SocialProofSection } from "@/components/landing/social-proof";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold text-text-primary">
            ClassPartner<span className="text-secondary">.ai</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-body-sm text-text-secondary hover:text-text-primary transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <SocialProofSection />
        <Footer />
      </div>
    </div>
  );
}
