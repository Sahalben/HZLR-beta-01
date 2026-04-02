import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TripleGuarantee } from "@/components/landing/TripleGuarantee";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MarketProof } from "@/components/landing/MarketProof";
import { BackupQueue } from "@/components/landing/BackupQueue";
import { Safety } from "@/components/landing/Safety";
import { ForWorkers } from "@/components/landing/ForWorkers";
import { ForEmployers } from "@/components/landing/ForEmployers";
import { Pricing } from "@/components/landing/Pricing";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TripleGuarantee />
        <HowItWorks />
        <MarketProof />
        <BackupQueue />
        <Safety />
        <ForWorkers />
        <ForEmployers />
        <Pricing />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
