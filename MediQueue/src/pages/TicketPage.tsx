import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Check, Clock, Users, Ticket, MessageCircle, Loader2, CheckCircle2, X, Mic, MicOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "@/context/LangContext";
import { useWhatsApp } from "@/hooks/useWhatsApp";
import { useDarijaVoice } from "@/hooks/useDarijaVoice";

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
  const { sendTicketNotification, loading: whatsappLoading, success: whatsappSent } = useWhatsApp();

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState<{
    number: number; service: string; serviceName: string; waitTime: number; position: number;
  } | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  // ─── Darija Voice ───────────────────────────────
  const { startListening, stopListening, isListening, transcript, error: voiceError, supported } =
    useDarijaVoice((result) => {
      if (result.name) setName(result.name);
      if (result.serviceId) setSelectedService(result.serviceId);
    });

  const generateTicket = () => {
    if (!selectedService || !name.trim()) return;
    const svc = services.find((s) => s.id === selectedService)!;
    const num = Math.floor(Math.random() * 40) + 10;
    const pos = Math.floor(Math.random() * 8) + 1;
    setTicket({
      number: num,
      service: selectedService,
      serviceName: svc.name[lang as keyof typeof svc.name],
      waitTime: pos * 4 + Math.floor(Math.random() * 5),
      position: pos,
    });
  };

  const handleSendWhatsApp = async () => {
    if (!ticket || !phone.trim()) return;
    setWhatsappError(null);
    const ok = await sendTicketNotification({
      phone, name,
      ticketNumber: ticket.number,
      service: ticket.serviceName,
      waitTime: ticket.waitTime,
      position: ticket.position,
    });
    if (!ok) setWhatsappError("Échec de l'envoi. Vérifiez votre numéro.");
  };

  const now = new Date();
  const isOpen = now.getHours() >= 8 && now.getHours() < 17;

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="max-w-2xl mx-auto px-6 py-10">
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

            {/* ─── BOUTON VOIX DARIJA ─── */}
            {supported && (
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      🎤 Parler en Darija
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Dites votre nom et le service — ex: <em>"اسمي Youssef، بغيت الراديولوجي"</em>
                    </p>
                  </div>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 shadow-soft ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-primary hover:opacity-90"
                    }`}
                  >
                    {isListening
                      ? <MicOff className="w-6 h-6 text-white" />
                      : <Mic className="w-6 h-6 text-primary-foreground" />
                    }
                  </button>
                </div>

                {/* Transcript en temps réel */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted/50 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">Écoute en cours...</span>
                      </div>
                      <p className="text-sm text-foreground min-h-[20px]">
                        {transcript || <span className="opacity-40">جي تهضر...</span>}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Résultat détecté */}
                {(name || selectedService) && !isListening && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {name && (
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        ✅ Nom: <strong>{name}</strong>
                      </span>
                    )}
                    {selectedService && (
                      <span className="inline-flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                        ✅ Service: <strong>{services.find(s => s.id === selectedService)?.name[lang as keyof typeof services[0]["name"]]}</strong>
                      </span>
                    )}
                  </motion.div>
                )}

                {voiceError && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <X className="w-3 h-3" /> {voiceError}
                  </p>
                )}
              </div>
            )}

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

            {/* Phone input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-green-500" />
                Numéro WhatsApp <span className="text-muted-foreground font-normal">(optionnel)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">+212</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="6XXXXXXXX"
                  type="tel"
                  maxLength={9}
                  className="w-full bg-card rounded-xl pl-14 pr-4 py-3 text-foreground border border-border/50 shadow-soft outline-none focus:ring-2 focus:ring-green-400/30 transition"
                />
              </div>
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
                    <p className="font-semibold text-sm text-foreground">{svc.name[lang as keyof typeof svc.name]}</p>
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
            <div className="bg-secondary/10 px-6 py-4 flex items-center gap-3 border-b border-border/50">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Check className="w-4 h-4 text-secondary-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t.ticketPage.generated}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t.ticketPage.number}</p>
                <p className="font-display text-6xl font-bold text-gradient">#{String(ticket.number).padStart(3, "0")}</p>
                <p className="text-sm text-muted-foreground mt-2">{ticket.serviceName}</p>
              </div>

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

              {/* WhatsApp */}
              <AnimatePresence>
                {!whatsappSent ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">Recevoir sur WhatsApp</p>
                    </div>
                    {phone ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Envoyer à <strong>+212 {phone}</strong></p>
                        <button onClick={handleSendWhatsApp} disabled={whatsappLoading}
                          className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
                          {whatsappLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <><MessageCircle className="w-4 h-4" /> Envoyer mon ticket</>}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">+212</span>
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="6XXXXXXXX" type="tel" maxLength={9}
                            className="w-full bg-white dark:bg-card rounded-lg pl-12 pr-4 py-2.5 text-sm border border-green-200 outline-none focus:ring-2 focus:ring-green-400/30 transition" />
                        </div>
                        <button onClick={handleSendWhatsApp} disabled={!phone.trim() || whatsappLoading}
                          className="w-full py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-40">
                          {whatsappLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : <><MessageCircle className="w-4 h-4" /> Envoyer sur WhatsApp</>}
                        </button>
                      </div>
                    )}
                    {whatsappError && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><X className="w-3 h-3" /> {whatsappError}</p>}
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">Ticket envoyé sur WhatsApp ! ✅</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Vous recevrez une alerte quand votre tour approche.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col items-center">
                <div className="bg-card p-4 rounded-xl border border-border/50 shadow-soft">
                  <QRCodeSVG value={`mediqueue://ticket/${ticket.service}/${ticket.number}/${name}`} size={160} fgColor="hsl(210, 40%, 12%)" bgColor="transparent" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">{t.ticketPage.scanInfo}</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
                <span className="text-sm font-medium text-secondary">{t.ticketPage.status}: {t.ticketPage.active}</span>
              </div>

              <div className="text-center border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="font-semibold text-foreground">{name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button onClick={() => { setTicket(null); setSelectedService(null); setName(""); setPhone(""); }}
                className="w-full py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition">
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