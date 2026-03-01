import { motion } from "framer-motion";
import { Clock, Users, RotateCcw, CalendarCheck } from "lucide-react";
import { useLang } from "@/context/LangContext";

const icons = [CalendarCheck, RotateCcw, Users, Clock];

const TicketRulesSection = () => {
  const { t } = useLang();

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">{t.tickets.label}</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.tickets.title1}<span className="text-gradient">{t.tickets.title2}</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.tickets.items.map((r, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border/50 text-center hover:shadow-elevated transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{r.label}</p>
                <p className="font-display text-2xl font-bold text-gradient mb-2">{r.value}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{r.detail}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TicketRulesSection;
