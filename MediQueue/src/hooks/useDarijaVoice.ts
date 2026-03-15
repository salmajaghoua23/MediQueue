// =====================================================
// MediQueue — src/hooks/useDarijaVoice.ts
// Reconnaissance vocale Darija pour remplir le formulaire
// =====================================================

export interface VoiceResult {
  name: string | null;
  serviceId: string | null;
  raw: string;
}

// Mots-clés Darija/Arabe/Français pour chaque service
const SERVICE_KEYWORDS: Record<string, string[]> = {
  radiologie: [
    "راديولوجي", "راديو", "radiologie", "radio", "أشعة", "اشعة", "chi3a", "chi3", "radyo"
  ],
  cardiologie: [
    "قلب", "كارديو", "cardiologie", "cardio", "galb", "qalb"
  ],
  pediatrie: [
    "أطفال", "اطفال", "درياري", "دراري", "pediatrie", "atfal", "drari", "enfants"
  ],
  urgences: [
    "أورجونس", "اورجونس", "طوارئ", "urgences", "urgence", "urjons", "تواري"
  ],
  dermatologie: [
    "جلد", "جلدية", "dermatologie", "derma", "jeld", "جلدي"
  ],
  ophtalmologie: [
    "عيون", "عينين", "ophtalmologie", "ophtalmo", "3ioun", "3inin", "oyoun"
  ],
};

function detectService(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [serviceId, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        return serviceId;
      }
    }
  }
  return null;
}

// Extrait le prénom depuis le texte
// Cherche après des mots déclencheurs comme "اسمي", "smiti", "je m'appelle"
function extractName(text: string): string | null {
  const triggers = [
    /اسمي\s+(\S+)/,
    /smiti\s+(\S+)/i,
    /ismi\s+(\S+)/i,
    /je m'appelle\s+(\S+)/i,
    /je suis\s+(\S+)/i,
    /اسمي\s+(\S+)/,
    /أنا\s+(\S+)/,
    /ana\s+(\S+)/i,
  ];

  for (const regex of triggers) {
    const match = text.match(regex);
    if (match) {
      const name = match[1].trim();
      // Capitaliser la première lettre
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  }

  // Si pas de déclencheur trouvé, prendre le premier mot qui ressemble à un prénom
  const words = text.trim().split(/\s+/);
  for (const word of words) {
    if (
      word.length >= 3 &&
      !Object.values(SERVICE_KEYWORDS).flat().some(kw =>
        kw.toLowerCase() === word.toLowerCase()
      )
    ) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }

  return null;
}

// ─── Hook principal ────────────────────────────────
import { useState, useRef, useCallback } from "react";

interface UseDarijaVoiceReturn {
  startListening: () => void;
  stopListening: () => void;
  isListening: boolean;
  transcript: string;
  result: VoiceResult | null;
  error: string | null;
  supported: boolean;
}

export function useDarijaVoice(
  onResult?: (result: VoiceResult) => void
): UseDarijaVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const supported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const startListening = useCallback(() => {
    if (!supported) {
      setError("Reconnaissance vocale non supportée sur ce navigateur.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Support Darija/Arabe + Français
    recognition.lang = "ar-MA"; // Arabe Marocain
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript("");
      setResult(null);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }

      const current = finalTranscript || interimTranscript;
      setTranscript(current);

      if (finalTranscript) {
        const parsed: VoiceResult = {
          name: extractName(finalTranscript),
          serviceId: detectService(finalTranscript),
          raw: finalTranscript,
        };
        setResult(parsed);
        onResult?.(parsed);
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        setError("Accès au micro refusé. Autorisez le micro dans votre navigateur.");
      } else if (event.error === "no-speech") {
        setError("Aucune voix détectée. Réessayez.");
      } else {
        setError("Erreur micro : " + event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [supported, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return {
    startListening,
    stopListening,
    isListening,
    transcript,
    result,
    error,
    supported,
  };
}