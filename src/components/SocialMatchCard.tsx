import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MessageCircle, UserPlus, Info } from "lucide-react";
import type { Roommate } from "../data/mockData";
import { formatCurrency } from "../data/mockData";

interface Props {
  roommate: Roommate;
  connected: boolean;
  onConnect: (id: string) => void;
  onMessage: (id: string) => void;
  index?: number;
}

export default function SocialMatchCard({
  roommate,
  connected,
  onConnect,
  onMessage,
  index = 0
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Circular progress stroke logic
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (roommate.compatibility / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-cards border border-border p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all h-full"
    >
      {/* Header: Avatar, Progress Ring, Online Dot */}
      <div className="flex items-start justify-between relative">
        <div className="relative">
          <img
            src={roommate.avatar}
            alt={roommate.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
          />
          {/* Online Dot */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>

        {/* Circular Progress Ring in top-right Header */}
        <div className="relative flex items-center justify-center w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-border"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              style={{ strokeDashoffset: offset }}
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute font-tag font-bold text-text-primary">
            {roommate.compatibility}%
          </span>
        </div>
      </div>

      {/* Identity Info */}
      <div className="space-y-1">
        <h3 className="font-h2 text-text-primary truncate">
          {roommate.name}
        </h3>
        <span className={`inline-block px-2.5 py-0.5 rounded-full font-tag font-bold uppercase tracking-[0.05em] ${roommate.status === "HAS_ROOM"
          ? "bg-badge-blue-bg text-badge-blue-text"
          : "bg-badge-green-bg text-badge-green-text"
          }`}>
          {t(`findPage.status${roommate.status === "HAS_ROOM" ? "HasRoom" : "NeedsRoom"}`)}
        </span>
      </div>

      {/* Bio: 2 lines max */}
      <p className="font-body text-text-secondary line-clamp-2 min-h-[42px]">
        {t(`bio.${roommate.id}`, roommate.bio)}
      </p>

      {/* Tags (Max 3 + More) */}
      <div className="flex flex-wrap gap-1.5 h-14 content-start">
        {roommate.lifestyleTags.slice(0, 3).map(tag => (
          <span key={tag} className="font-tag px-2.5 py-1 bg-filter-bg text-text-secondary rounded-full border border-border">
            {t(`lifestyle.${tag}`, tag)}
          </span>
        ))}
        {roommate.lifestyleTags.length > 3 && (
          <span className="font-tag px-2.5 py-1 bg-white text-text-secondary rounded-full border border-border">
            +{roommate.lifestyleTags.length - 3}
          </span>
        )}
      </div>

      {/* Budget range: small, Caption weight */}
      <div className="pb-2 border-b border-border/40">
        <span className="font-caption text-text-secondary font-medium uppercase tracking-wider">
          {t('common.budget')}: {formatCurrency(roommate.budget.max)}
        </span>
      </div>

      {/* Action Buttons: Side-by-side */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => navigate(`/user/${roommate.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-buttons border border-primary text-primary font-h3 transition-all hover:bg-primary/5 cursor-pointer"
        >
          <Info size={16} />
          {t('common.view')}
        </button>
        {connected ? (
          <button
            onClick={() => onMessage(roommate.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-buttons bg-primary text-white font-h3 transition-all hover:bg-primary-dark cursor-pointer shadow-sm"
          >
            <MessageCircle size={16} />
            {t('common.message')}
          </button>
        ) : (
          <button
            onClick={() => onConnect(roommate.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-buttons bg-primary text-white font-h3 transition-all hover:bg-primary-dark cursor-pointer shadow-sm"
          >
            <UserPlus size={16} />
            {t('common.connect')}
          </button>
        )}
      </div>
    </motion.div>
  );
}
