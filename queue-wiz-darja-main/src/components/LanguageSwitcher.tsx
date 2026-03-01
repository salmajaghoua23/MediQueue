import { useLang } from "@/context/LangContext";
import { Globe } from "lucide-react";

const langLabels = { fr: "FR", ar: "عربية", darija: "دارجة" } as const;

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 bg-card rounded-full p-1 shadow-soft border border-border/50">
      <Globe className="w-3.5 h-3.5 text-muted-foreground mx-1.5" />
      {(Object.keys(langLabels) as Array<keyof typeof langLabels>).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {langLabels[l]}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
