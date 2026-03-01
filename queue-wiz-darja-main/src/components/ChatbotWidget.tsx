import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useLang } from "@/context/LangContext";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
}

const botResponses: Record<string, string[]> = {
  fr: [
    "مرحبا بيك فـ MediQueue! شنو بغيتي?",
    "واخا، غادي نعطيك التيكي ديالك. شنو السيرفيس لي بغيتي?",
    "تمام! النمرة ديالك هي 24 فسيرفيس الراديولوجي. باقي تقريبا 15 دقيقة. 😊",
    "إلا بغيتي تعرف شحال باقي، قولي 'الوقت' وغادي نقولك.",
    "باقي 12 دقيقة قبل الدور ديالك. صبر شويا! 💪",
    "تقدر تجلس وتسترخا، غادي نوتيفيك ملي يقرب الدور ديالك.",
  ],
  default: [
    "مرحبا بيك فـ MediQueue! شنو بغيتي?",
    "واخا، غادي نعطيك التيكي ديالك. شنو السيرفيس لي بغيتي?",
    "تمام! النمرة ديالك هي 24 فسيرفيس الراديولوجي. باقي تقريبا 15 دقيقة. 😊",
    "إلا بغيتي تعرف شحال باقي، قولي 'الوقت' وغادي نقولك.",
    "باقي 12 دقيقة قبل الدور ديالك. صبر شويا! 💪",
    "تقدر تجلس وتسترخا، غادي نوتيفيك ملي يقرب الدور ديالك.",
  ],
};

const ChatbotWidget = () => {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [responseIndex, setResponseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ id: 1, text: botResponses.default[0], sender: "bot" }]);
        setResponseIndex(1);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const idx = responseIndex % botResponses.default.length;
      const botMsg: Message = { id: Date.now() + 1, text: botResponses.default[idx], sender: "bot" };
      setMessages((prev) => [...prev, botMsg]);
      setResponseIndex((prev) => prev + 1);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] max-h-[500px] rounded-2xl bg-card shadow-elevated border border-border/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/50 bg-primary/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">MQ</span>
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-foreground">{t.chatbot.title}</p>
                <p className="text-[10px] text-muted-foreground">{t.chatbot.subtitle}</p>
              </div>
              <div className="ml-auto w-2 h-2 rounded-full bg-secondary animate-pulse-soft" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[340px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                    dir="rtl"
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.chatbot.placeholder}
                  className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
