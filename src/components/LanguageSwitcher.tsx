import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggle = () => {
        const next = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(next);
        localStorage.setItem("language", next);
    };

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border-0 bg-primary/10 text-primary hover:bg-primary/20"
            title={i18n.language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
        >
            <Globe size={14} />
            {i18n.language === "vi" ? "EN" : "VI"}
        </button>
    );
}
