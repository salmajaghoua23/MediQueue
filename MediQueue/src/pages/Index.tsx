import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TicketRulesSection from "@/components/TicketRulesSection";
import ScenarioSection from "@/components/ScenarioSection";
import ChatbotWidget from "@/components/ChatbotWidget";
import { useLang } from "@/context/LangContext";

const Index = () => {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TicketRulesSection />
      <ScenarioSection />
      <ChatbotWidget />

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xs">MQ</span>
            </div>
            <span className="font-display font-semibold text-foreground">MediQueue</span>
          </div>
          <p className="text-sm text-muted-foreground">{t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
