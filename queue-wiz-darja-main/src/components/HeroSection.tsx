import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.jpg";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang } from "@/context/LangContext";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 glow pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16">
        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">MQ</span>
            </div>
            <span className="font-display font-bold text-xl text-foreground">MediQueue</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-xs font-medium bg-secondary/20 text-secondary px-3 py-1.5 rounded-full border border-secondary/30 hidden sm:inline">
              {t.nav.hackathon}
            </span>
          </div>
        </nav>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
            <span className="text-xs font-medium text-accent-foreground">{t.hero.badge}</span>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-5">
            {t.hero.title1}{" "}
            <span className="text-gradient">{t.hero.title2}</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            {t.hero.subtitle} <strong className="text-foreground">{t.hero.darija}</strong>{t.hero.subtitleEnd}
          </p>

          <Link
            to="/ticket"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:opacity-90 transition group"
          >
            {t.hero.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden shadow-elevated border border-border/50">
            <img
              src={heroImage}
              alt="MediQueue - Illustration conceptuelle"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -left-4 top-1/3 bg-card rounded-xl p-3 shadow-elevated border border-border/50 animate-float hidden lg:flex items-center gap-2">
            <span className="text-2xl">🇲🇦</span>
            <div>
              <p className="text-xs font-semibold text-foreground">Chatbot Darija</p>
              <p className="text-[10px] text-muted-foreground">أهلاً، شنو بغيتي؟</p>
            </div>
          </div>
          <div className="absolute -right-4 top-1/2 bg-card rounded-xl p-3 shadow-elevated border border-border/50 animate-float hidden lg:flex items-center gap-2" style={{ animationDelay: "1.5s" }}>
            <span className="text-2xl">🎫</span>
            <div>
              <p className="text-xs font-semibold text-foreground">Ticket #042</p>
              <p className="text-[10px] text-muted-foreground">~12 min d'attente</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
