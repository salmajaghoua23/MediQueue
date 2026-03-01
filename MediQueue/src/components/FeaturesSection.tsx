import { motion } from "framer-motion";
import { QrCode, MessageCircle, Clock, RotateCcw, Users, Shield } from "lucide-react";
import { useLang } from "@/context/LangContext";

const icons = [QrCode, MessageCircle, Clock, RotateCcw, Users, Shield];

const FeaturesSection = () => {
  const { t } = useLang();

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">{t.features.label}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.features.title1}<span className="text-gradient">{t.features.title2}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.items.map((feature, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card-gradient rounded-xl p-6 shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
