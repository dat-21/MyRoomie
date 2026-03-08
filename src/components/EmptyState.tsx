import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({
    title,
    description,
}: EmptyStateProps) {
    const { t } = useTranslation();
    const displayTitle = title || t('emptyState.noRoommates');
    const displayDesc = description || t('emptyState.tryAdjusting');
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-20 text-center"
        >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                <SearchX size={40} className="text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2 font-[family-name:var(--font-family-heading)]">{displayTitle}</h3>
            <p className="text-sm text-text-muted max-w-sm">{displayDesc}</p>
        </motion.div>
    );
}
