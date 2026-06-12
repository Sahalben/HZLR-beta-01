import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { WhyHZLR } from "@/components/landing/WhyHZLR";
import { MarketProof } from "@/components/landing/MarketProof";
import { BackupQueue } from "@/components/landing/BackupQueue";
import { Safety } from "@/components/landing/Safety";
import { ForWorkers } from "@/components/landing/ForWorkers";
import { ForEmployers } from "@/components/landing/ForEmployers";
import { Pricing } from "@/components/landing/Pricing";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
// import { StoreShowcase } from "@/components/landing/StoreShowcase"; // STORE_DELAYED

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <InteractiveDemo />
        {/* <StoreShowcase /> STORE_DELAYED */}
        <WhyHZLR />
        <ForWorkers />
        {/* <MarketProof /> */}
        <BackupQueue />
        <ForEmployers />
        <Pricing />
        <Safety />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
