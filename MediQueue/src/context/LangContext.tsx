import React, { createContext, useContext, useState } from "react";

type Lang = "fr" | "ar" | "darija";

const translations = {
  fr: {
    nav: { hackathon: "🏆 Projet Hackathon", scanTicket: "Scanner un ticket" },
    hero: {
      badge: "Plateforme digitale intelligente",
      title1: "Fini l'attente chaotique,",
      title2: "bienvenue MediQueue",
      subtitle: "Une solution intelligente pour gérer les files d'attente dans les hôpitaux. Scannez, interagissez en",
      darija: "Darija",
      subtitleEnd: ", et suivez votre tour en temps réel.",
      cta: "Obtenir mon ticket",
    },
    features: {
      label: "Fonctionnalités",
      title1: "Une gestion intelligente des ",
      title2: "files d'attente",
      items: [
        { title: "Scan QR Code", description: "Le patient scanne un QR code à l'entrée de l'hôpital pour rejoindre la file d'attente virtuellement." },
        { title: "Chatbot en Darija", description: "Un chatbot intelligent en Darija guide le patient, donne son numéro de tour et le temps d'attente estimé." },
        { title: "Temps d'attente en temps réel", description: "Suivi en direct du temps restant avant le passage, avec notifications automatiques." },
        { title: "Remise à zéro quotidienne", description: "Chaque jour, le compteur de tickets est automatiquement réinitialisé pour une gestion optimale." },
        { title: "Capacité limitée par service", description: "La génération des tickets est limitée selon la capacité journalière de chaque service." },
        { title: "Horaires d'ouverture", description: "Les tickets virtuels sont générés uniquement pendant les heures d'ouverture de l'hôpital." },
      ],
    },
    howItWorks: {
      label: "Comment ça marche",
      title1: "Simple comme ",
      title2: "1, 2, 3",
      steps: [
        { title: "Scanner le QR Code", description: "À l'entrée de l'hôpital, scannez le code QR avec votre téléphone." },
        { title: "Interagir avec le Chatbot", description: "Le chatbot en Darija vous attribue un numéro et vous informe du temps d'attente." },
        { title: "Suivre votre position", description: "Suivez en temps réel votre position dans la file et recevez des alertes." },
      ],
    },
    tickets: {
      label: "Gestion des Tickets",
      title1: "Règles de génération ",
      title2: "intelligentes",
      items: [
        { label: "Horaires d'ouverture", value: "8h - 17h", detail: "Tickets générés uniquement pendant les heures de service" },
        { label: "Remise à zéro", value: "Quotidienne", detail: "Compteur réinitialisé chaque matin automatiquement" },
        { label: "Capacité / service", value: "Limitée", detail: "Nombre de tickets adapté à la capacité du service" },
        { label: "Temps moyen", value: "~15 min", detail: "Réduction significative du temps d'attente" },
      ],
    },
    scenario: {
      label: "Scénario",
      title1: "L'expérience de ",
      title2: "Fatima",
      steps: [
        "Fatima arrive à l'hôpital pour une consultation.",
        "Elle scanne le QR Code à l'entrée.",
        "Le chatbot lui répond :",
        "Fatima peut attendre confortablement sans rester debout dans la file.",
      ],
      chatMessage: "Salam Fatima! Tu es dans la file pour le service Radiologie. Ton numéro est 24. Il reste environ 15 minutes avant ton tour.",
    },
    footer: "© 2026 MediQueue — Projet Hackathon 🏆 Innovation hospitalière",
    ticketPage: {
      title: "Votre Ticket MediQueue",
      service: "Service",
      number: "Numéro de tour",
      waitTime: "Temps d'attente estimé",
      position: "Position dans la file",
      status: "Statut",
      active: "Actif",
      generated: "Ticket généré avec succès",
      scanInfo: "Présentez ce QR code à l'accueil",
      back: "Retour à l'accueil",
      selectService: "Choisissez votre service",
      getTicket: "Obtenir mon ticket",
      yourName: "Votre prénom",
    },
    chatbot: {
      title: "MediQueue Bot",
      subtitle: "Assistant en Darija",
      placeholder: "Écrivez un message...",
      send: "Envoyer",
    },
  },
  ar: {
    nav: { hackathon: "🏆 مشروع هاكاثون", scanTicket: "مسح التذكرة" },
    hero: {
      badge: "منصة رقمية ذكية",
      title1: "لا مزيد من الانتظار الفوضوي،",
      title2: "مرحباً MediQueue",
      subtitle: "حل ذكي لإدارة طوابير الانتظار في المستشفيات. امسح، تفاعل بـ",
      darija: "الدارجة",
      subtitleEnd: "، وتابع دورك في الوقت الحقيقي.",
      cta: "احصل على تذكرتك",
    },
    features: {
      label: "المميزات",
      title1: "إدارة ذكية لـ",
      title2: "طوابير الانتظار",
      items: [
        { title: "مسح رمز QR", description: "يمسح المريض رمز QR عند مدخل المستشفى للانضمام إلى طابور الانتظار افتراضياً." },
        { title: "شات بوت بالدارجة", description: "شات بوت ذكي بالدارجة يوجه المريض ويعطيه رقم دوره ووقت الانتظار المقدر." },
        { title: "وقت الانتظار الحقيقي", description: "متابعة مباشرة للوقت المتبقي قبل الدور مع إشعارات تلقائية." },
        { title: "إعادة تعيين يومية", description: "كل يوم يتم إعادة تعيين عداد التذاكر تلقائياً لإدارة مثالية." },
        { title: "سعة محدودة لكل قسم", description: "توليد التذاكر محدود حسب السعة اليومية لكل قسم." },
        { title: "ساعات العمل", description: "يتم توليد التذاكر الافتراضية فقط خلال ساعات عمل المستشفى." },
      ],
    },
    howItWorks: {
      label: "كيف يعمل",
      title1: "بسيط مثل ",
      title2: "١، ٢، ٣",
      steps: [
        { title: "مسح رمز QR", description: "عند مدخل المستشفى، امسح رمز QR بهاتفك." },
        { title: "التفاعل مع الشات بوت", description: "الشات بوت بالدارجة يعطيك رقمك ويخبرك بوقت الانتظار." },
        { title: "تتبع موقعك", description: "تابع في الوقت الحقيقي موقعك في الطابور واستقبل التنبيهات." },
      ],
    },
    tickets: {
      label: "إدارة التذاكر",
      title1: "قواعد توليد ",
      title2: "ذكية",
      items: [
        { label: "ساعات العمل", value: "8 - 17", detail: "التذاكر تُولّد فقط خلال ساعات الخدمة" },
        { label: "إعادة تعيين", value: "يومية", detail: "العداد يُعاد تعيينه كل صباح تلقائياً" },
        { label: "سعة / قسم", value: "محدودة", detail: "عدد التذاكر مُكيّف مع سعة القسم" },
        { label: "متوسط الوقت", value: "~15 دق", detail: "تقليل كبير في وقت الانتظار" },
      ],
    },
    scenario: {
      label: "سيناريو",
      title1: "تجربة ",
      title2: "فاطمة",
      steps: [
        "فاطمة تصل إلى المستشفى لاستشارة.",
        "تمسح رمز QR عند المدخل.",
        "الشات بوت يرد عليها:",
        "فاطمة يمكنها الانتظار براحة دون الوقوف في الطابور.",
      ],
      chatMessage: "سلام فاطمة! أنتِ في طابور قسم الأشعة. رقمك هو 24. بقي حوالي 15 دقيقة قبل دورك.",
    },
    footer: "© 2026 MediQueue — مشروع هاكاثون 🏆 ابتكار مستشفى",
    ticketPage: {
      title: "تذكرتك MediQueue",
      service: "القسم",
      number: "رقم الدور",
      waitTime: "وقت الانتظار المقدر",
      position: "الموقع في الطابور",
      status: "الحالة",
      active: "نشط",
      generated: "تم توليد التذكرة بنجاح",
      scanInfo: "قدم رمز QR هذا في الاستقبال",
      back: "العودة للرئيسية",
      selectService: "اختر القسم",
      getTicket: "احصل على تذكرتك",
      yourName: "اسمك الأول",
    },
    chatbot: {
      title: "MediQueue بوت",
      subtitle: "مساعد بالدارجة",
      placeholder: "اكتب رسالة...",
      send: "إرسال",
    },
  },
  darija: {
    nav: { hackathon: "🏆 مشروع هاكاثون", scanTicket: "سكاني التيكي" },
    hero: {
      badge: "منصة ديجيتال ذكية",
      title1: "سالا الانتظار الخايب،",
      title2: "مرحبا MediQueue",
      subtitle: "حل ذكي باش نديرو الطوابير ف السبيطار. سكاني، هضر بـ",
      darija: "الدارجة",
      subtitleEnd: "، وتبع الدور ديالك لايف.",
      cta: "جيب التيكي ديالي",
    },
    features: {
      label: "المميزات",
      title1: "تسيير ذكي ديال ",
      title2: "الطوابير",
      items: [
        { title: "سكاني QR Code", description: "المريض كيسكاني QR code فالباب ديال السبيطار باش يدخل للطابور فيرتيال." },
        { title: "شات بوت بالدارجة", description: "شات بوت ذكي بالدارجة كيوجه المريض، كيعطيه النمرة ديالو والوقت ديال الانتظار." },
        { title: "الوقت لايف", description: "تبع الوقت لي باقي قبل الدور ديالك مع الإشعارات أوتوماتيك." },
        { title: "ريميز أ زيرو يومي", description: "كل نهار الكونتور ديال التيكيات كيرجع لزيرو أوتوماتيك." },
        { title: "كاباسيتي محدودة", description: "التيكيات محدودين حسب الكاباسيتي ديال كل سيرفيس فالنهار." },
        { title: "أوقات الخدمة", description: "التيكيات الفيرتيال كيتجنيرو غير فأوقات الخدمة ديال السبيطار." },
      ],
    },
    howItWorks: {
      label: "كيفاش خدام",
      title1: "ساهل بحال ",
      title2: "1، 2، 3",
      steps: [
        { title: "سكاني QR Code", description: "فالباب ديال السبيطار، سكاني QR Code بالتيليفون ديالك." },
        { title: "هضر مع الشات بوت", description: "الشات بوت بالدارجة كيعطيك النمرة ديالك وكيقولك شحال باقي." },
        { title: "تبع البلاصة ديالك", description: "تبع لايف فين وصلتي فالطابور وخود الإشعارات." },
      ],
    },
    tickets: {
      label: "تسيير التيكيات",
      title1: "قواعد التوليد ",
      title2: "الذكية",
      items: [
        { label: "أوقات الخدمة", value: "8 - 17", detail: "التيكيات كيتجنيرو غير فأوقات الخدمة" },
        { label: "ريميز أ زيرو", value: "يومي", detail: "الكونتور كيرجع لزيرو كل صباح أوتوماتيك" },
        { label: "كاباسيتي / سيرفيس", value: "محدودة", detail: "عدد التيكيات على حسب كاباسيتي السيرفيس" },
        { label: "الوقت المتوسط", value: "~15 دقيقة", detail: "نقصان كبير ديال وقت الانتظار" },
      ],
    },
    scenario: {
      label: "سيناريو",
      title1: "تجربة ",
      title2: "فاطمة",
      steps: [
        "فاطمة جات للسبيطار باش تدير كونسولتاسيون.",
        "سكانات QR Code فالباب.",
        "الشات بوت جاوبها:",
        "فاطمة تقدر تتسنا مرتاحة بلا ما توقف فالطابور.",
      ],
      chatMessage: "سلام فاطمة! نتي فالطابور ديال سيرفيس الراديولوجي. النمرة ديالك 24. باقي تقريبا 15 دقيقة قبل الدور ديالك.",
    },
    footer: "© 2026 MediQueue — مشروع هاكاثون 🏆 ابتكار صحي",
    ticketPage: {
      title: "التيكي ديالك MediQueue",
      service: "السيرفيس",
      number: "نمرة الدور",
      waitTime: "الوقت المقدر ديال الانتظار",
      position: "البلاصة فالطابور",
      status: "الحالة",
      active: "نشط",
      generated: "التيكي تجنيرا بنجاح",
      scanInfo: "وري هاد QR code فالأكاي",
      back: "رجع للأكاي",
      selectService: "ختار السيرفيس",
      getTicket: "جيب التيكي",
      yourName: "السمية ديالك",
    },
    chatbot: {
      title: "MediQueue بوت",
      subtitle: "مساعد بالدارجة",
      placeholder: "كتب شي ميساج...",
      send: "صيفط",
    },
  },
};

type Translations = typeof translations.fr;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  isRtl: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "fr",
  setLang: () => {},
  t: translations.fr,
  isRtl: false,
});

export const useLang = () => useContext(LangContext);

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>("fr");
  const t = translations[lang];
  const isRtl = lang === "ar" || lang === "darija";

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRtl }}>
      <div dir={isRtl ? "rtl" : "ltr"}>
        {children}
      </div>
    </LangContext.Provider>
  );
};
