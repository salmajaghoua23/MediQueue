// =====================================================
// MediQueue — Backend Express (server.ts)
// À placer à la RACINE de votre projet MediQueue
// =====================================================
// Installation : npm install express twilio cors dotenv @types/express @types/cors

import express from "express";
import twilio from "twilio";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Format numéro marocain → WhatsApp
function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-]/g, "");
  if (cleaned.startsWith("+212")) return `whatsapp:${cleaned}`;
  if (cleaned.startsWith("0")) return `whatsapp:+212${cleaned.slice(1)}`;
  return `whatsapp:+212${cleaned}`;
}

// ─── Route : Envoyer notification ticket ───────────────
app.post("/api/notify", async (req, res) => {
  const { phone, name, ticketNumber, service, waitTime, position } = req.body;

  if (!phone || !ticketNumber) {
    return res.status(400).json({ error: "Numéro et ticket requis" });
  }

  const message = `🏥 *MediQueue*\n\nBonjour ${name} 👋\n\nVotre ticket a été généré avec succès !\n\n🎫 *Ticket :* #${String(ticketNumber).padStart(3, "0")}\n🏥 *Service :* ${service}\n⏱ *Temps d'attente :* ~${waitTime} min\n👥 *Position :* ${position} dans la file\n\n_Vous recevrez une alerte quand votre tour approche._\n\n✅ MediQueue — Fin de l'attente chaotique`;

  try {
    const msg = await client.messages.create({
      from: "whatsapp:+14155238886", // Sandbox Twilio
      to: formatPhone(phone),
      body: message,
    });

    res.json({ success: true, sid: msg.sid });
  } catch (error: any) {
    console.error("Twilio error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ─── Route : Alerte "bientôt votre tour" ───────────────
app.post("/api/notify-soon", async (req, res) => {
  const { phone, name, ticketNumber, minutesLeft } = req.body;

  const message = `⚡ *MediQueue — Votre tour approche !*\n\nBonjour ${name}, il reste environ *${minutesLeft} minutes* avant votre passage.\n\n🎫 Ticket : #${String(ticketNumber).padStart(3, "0")}\n\nMerci de vous rapprocher de l'accueil. 🏥`;

  try {
    const msg = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: formatPhone(phone),
      body: message,
    });

    res.json({ success: true, sid: msg.sid });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ MediQueue server running on port ${PORT}`));