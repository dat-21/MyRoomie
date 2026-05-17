import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Wallet, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Roommate } from "../types";
import { formatCurrency } from "../lib/format";

interface RoommateCardProps {
  roommate: Roommate;
  index?: number;
}

export default function RoommateCard({ roommate, index = 0 }: RoommateCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col bg-card-bg rounded-cards border border-border hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
    >
      {/* Visual Section: Top Half */}
      <div className="relative h-56 overflow-hidden bg-filter-bg">
        <img
          src={roommate.avatar}
          alt={roommate.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Compatibility Badge - Star + Percentage */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm border border-white/20">
          <Star size={14} className="text-primary fill-primary" />
          <span className="font-caption font-semibold text-text-primary">{roommate.compatibility}%</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        {/* Header: Name and Status */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-h2 text-text-primary truncate">
              {roommate.name}
            </h3>
            <span className={`px-2.5 py-1 rounded-full font-tag font-bold uppercase tracking-[0.05em] whitespace-nowrap ${
              roommate.status === "HAS_ROOM" 
              ? "bg-badge-blue-bg text-badge-blue-text" 
              : "bg-badge-green-bg text-badge-green-text"
            }`}>
              {t(`findPage.status${roommate.status === "HAS_ROOM" ? "HasRoom" : "NeedsRoom"}`)}
            </span>
          </div>
          
          {/* Age + Job: Caption Regular */}
          <p className="font-caption text-text-secondary">
            {roommate.age} {t('common.years')} · {t(`occupation.${roommate.occupation}`, roommate.occupation)}
          </p>
        </div>

        {/* Transactional Info Row: Ngân sách & Chuyển vào */}
        <div className="grid grid-cols-2 gap-4 mb-5 p-3.5 bg-filter-bg rounded-xl border border-border/50">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Wallet size={12} />
              <span className="font-caption uppercase tracking-[0.05em] font-medium">{t('common.budget')}</span>
            </div>
            <p className="font-body font-semibold text-text-primary">
              {formatCurrency(roommate.budget.max)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Calendar size={12} />
              <span className="font-caption uppercase tracking-[0.05em] font-medium">{t('common.moveIn')}</span>
            </div>
            <p className="font-body font-semibold text-text-primary">
              {roommate.moveInDate}
            </p>
          </div>
        </div>

        {/* Location & Tags */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 text-text-secondary">
            <MapPin size={14} className="text-primary/60" />
            <span className="font-caption">{t(`district.${roommate.location}`, roommate.location)}</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {roommate.lifestyleTags.slice(0, 3).map(tag => (
              <span key={tag} className="font-tag px-2.5 py-1 bg-filter-bg text-text-secondary rounded-full border border-border">
                {t(`lifestyle.${tag}`, tag)}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: Full width teal */}
        <button
          onClick={() => navigate(`/user/${roommate.id}`)}
          className="mt-6 w-full py-3 rounded-buttons bg-primary text-white font-h3 hover:bg-primary-dark transition-colors cursor-pointer shadow-sm"
        >
          {t('roommateCard.viewDetails')}
        </button>
      </div>
    </motion.div>
  );
}
