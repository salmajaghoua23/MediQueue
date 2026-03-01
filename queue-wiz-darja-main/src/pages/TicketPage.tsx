import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, Clock, Users, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LangContext";

const services = [
  { id: "radiologie", name: { fr: "Radiologie", ar: "الأشعة", darija: "الراديولوجي" }, capacity: 40, icon: "🩻" },
  { id: "cardiologie", name: { fr: "Cardiologie", ar: "القلب", darija: "القلب" }, capacity: 30, icon: "❤️" },
  { id: "pediatrie", name: { fr: "Pédiatrie", ar: "الأطفال", darija: "الأطفال" }, capacity: 35, icon: "👶" },
  { id: "urgences", name: { fr: "Urgences", ar: "الطوارئ", darija: "الأورجونس" }, capacity: 50, icon: "🚑" },
  { id: "dermatologie", name: { fr: "Dermatologie", ar: "الجلدية", darija: "الجلد" }, capacity: 25, icon: "🧴" },
  { id: "ophtalmologie", name: { fr: "Ophtalmologie", ar: "العيون", darija: "العينين" }, capacity: 20, icon: "👁️" },
];

const TicketPage = () => {
  const { t, lang } = useLang();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ticket, setTicket] = useState<{ number: number; service: string; serviceName: string; waitTime: number; position: number } | null>(null);

  const generateTicket = () => {
    if (!selectedService || !name.trim()) return;
    const svc = services.find((s) => s.id === selectedService)!;
    const num = Math.floor(Math.random() * 40) + 10;
    const pos = Math.floor(Math.random() * 8) + 1;
    setTicket({
      number: num,
      service: selectedService,
      serviceName: svc.name[lang],
      waitTime: pos * 4 + Math.floor(Math.random() * 5),
      position: pos,
    });
  };

  const now = new Date();
  const isOpen = now.getHours() >= 8 && now.getHours() < 17;

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.ticketPage.back}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">{t.ticketPage.title}</h1>
        </motion.div>

        {!ticket ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{t.ticketPage.yourName}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Fatima..."
                className="w-full bg-card rounded-xl px-4 py-3 text-foreground border border-border/50 shadow-soft outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            {/* Service selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">{t.ticketPage.selectService}</label>
              <div className="grid grid-cols-2 gap-3">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedService === svc.id
                        ? "border-primary bg-accent shadow-soft"
                        : "border-border/50 bg-card hover:border-primary/30 shadow-card"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{svc.icon}</span>
                    <p className="font-semibold text-sm text-foreground">{svc.name[lang]}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {svc.capacity}/jour
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className={`rounded-xl p-3 flex items-center gap-3 ${isOpen ? "bg-secondary/10 border border-secondary/30" : "bg-destructive/10 border border-destructive/30"}`}>
              <div className={`w-3 h-3 rounded-full ${isOpen ? "bg-secondary animate-pulse-soft" : "bg-destructive"}`} />
              <span className="text-sm text-foreground">
                {isOpen ? "🟢 Hôpital ouvert — Tickets disponibles" : "🔴 Hôpital fermé — Réessayez entre 8h-17h"}
              </span>
            </div>

            {/* Generate */}
            <button
              onClick={generateTicket}
              disabled={!selectedService || !name.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.ticketPage.getTicket}
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-card rounded-2xl shadow-elevated border border-border/50 overflow-hidden"
          >
            {/* Success header */}
            <div className="bg-secondary/10 px-6 py-4 flex items-center gap-3 border-b border-border/50">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Check className="w-4 h-4 text-secondary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t.ticketPage.generated}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket number */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.ticketPage.number}</p>
                <p className="font-display text-6xl font-bold text-gradient">#{String(ticket.number).padStart(3, "0")}</p>
                <p className="text-sm text-muted-foreground mt-2">{ticket.serviceName}</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t.ticketPage.waitTime}</p>
                  <p className="font-display text-xl font-bold text-foreground">{ticket.waitTime} min</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{t.ticketPage.position}</p>
                  <p className="font-display text-xl font-bold text-foreground">{ticket.position}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center">
                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-soft">
                  <QRCodeSVG
                    value={`mediqueue://ticket/${ticket.service}/${ticket.number}/${name}`}
                    size={160}
                    fgColor="hsl(210, 40%, 12%)"
                    bgColor="transparent"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-3">{t.ticketPage.scanInfo}</p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
                <span className="text-sm font-medium text-secondary">{t.ticketPage.status}: {t.ticketPage.active}</span>
              </div>

              {/* Patient name */}
              <div className="text-center border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="font-semibold text-foreground">{name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => { setTicket(null); setSelectedService(null); setName(""); }}
                className="w-full py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition"
              >
                {t.ticketPage.back}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TicketPage;
