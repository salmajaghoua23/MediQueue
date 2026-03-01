import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import { Check } from "lucide-react";

const ScenarioSection = () => {
  const { t } = useLang();

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">{t.scenario.label}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.scenario.title1}<span className="text-gradient">{t.scenario.title2}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Steps */}
          <div className="space-y-4">
            {t.scenario.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>

          {/* Chat mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-elevated border border-border/50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border/50 bg-primary/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xs">MQ</span>
              </div>
              <div>
                <p className="font-display font-semibold text-xs text-foreground">MediQueue Bot</p>
                <p className="text-[10px] text-muted-foreground">🟢 En ligne</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm text-foreground max-w-[85%] leading-relaxed" dir="rtl">
                  {t.scenario.chatMessage}
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm">
                  شكرا! 😊
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScenarioSection;
