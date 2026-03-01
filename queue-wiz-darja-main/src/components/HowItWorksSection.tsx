import { motion } from "framer-motion";
import { Smartphone, MessageCircle, BarChart3 } from "lucide-react";
import { useLang } from "@/context/LangContext";

const icons = [Smartphone, MessageCircle, BarChart3];

const HowItWorksSection = () => {
  const { t } = useLang();

  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">{t.howItWorks.label}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.howItWorks.title1}<span className="text-gradient">{t.howItWorks.title2}</span>
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          {t.howItWorks.steps.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex-1 flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-card shadow-card border border-border/50 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{s.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
