// =====================================================
// MediQueue — src/hooks/useWhatsApp.ts
// =====================================================

import { useState } from "react";

interface NotifyParams {
  phone: string;
  name: string;
  ticketNumber: number;
  service: string;
  waitTime: number;
  position: number;
}

interface UseWhatsAppReturn {
  sendTicketNotification: (params: NotifyParams) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useWhatsApp(): UseWhatsAppReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendTicketNotification = async (params: NotifyParams): Promise<boolean> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:3001/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erreur d'envoi");

      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { sendTicketNotification, loading, error, success };
}