import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  BadgeCheck,
  Building,
  Users,
  Star,
  Home,
  Eye,
  MessageCircle,
  Briefcase,
  Wallet,
  Heart,
  Shield,
} from "lucide-react";
import { formatCurrency } from "../../data/mockData";
import type { AdminLandlord, AdminTenant } from "../../data/adminData";

type UserType = AdminLandlord | AdminTenant;

interface AdminUserModalProps {
  user: UserType | null;
  type: "landlord" | "tenant";
  mode: "view" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSave?: (user: UserType) => void;
}

export default function AdminUserModal({
  user,
  type,
  mode,
  isOpen,
  onClose,
  onSave,
}: AdminUserModalProps) {
  const [editedUser, setEditedUser] = useState<UserType | null>(user);

  if (!user) return null;

  const isLandlord = type === "landlord";
  const landlord = user as AdminLandlord;
  const tenant = user as AdminTenant;
  const isEditing = mode === "edit";

  const handleSave = () => {
    if (editedUser && onSave) {
      onSave(editedUser);
    }
    onClose();
  };

  const updateField = (field: string, value: string | number | boolean) => {
    if (editedUser) {
      setEditedUser({ ...editedUser, [field]: value });
    }
  };

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    { value: "suspended", label: "Suspended", color: "bg-red-100 text-red-700" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] overflow-auto glass-strong rounded-3xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 glass-strong px-6 py-4 border-b border-white/20 flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isLandlord
                      ? "bg-gradient-to-br from-primary to-primary-light"
                      : "bg-gradient-to-br from-secondary to-secondary-light"
                  }`}
                >
                  {isLandlord ? (
                    <Building size={20} className="text-white" />
                  ) : (
                    <Users size={20} className="text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)]">
                    {isEditing ? "Edit" : "View"} {isLandlord ? "Landlord" : "Tenant"}
                  </h3>
                  <p className="text-xs text-text-muted">
                    {isEditing ? "Update user information" : "User profile details"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/60 flex items-center justify-center hover:bg-white/80 transition-colors cursor-pointer border-0"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-primary/10"
                  />
                  {user.verified && (
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow-md">
                      <BadgeCheck size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser?.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)] bg-white/60 px-3 py-2 rounded-xl border border-white/40 w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  ) : (
                    <h4 className="text-xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                      {user.name}
                    </h4>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusOptions.find((s) => s.value === user.status)?.color
                      }`}
                    >
                      <Shield size={10} />
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    {user.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                        <BadgeCheck size={10} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="glass rounded-2xl p-4 space-y-3">
                <h5 className="text-sm font-semibold text-text flex items-center gap-2">
                  <User size={14} className="text-primary" />
                  Contact Information
                </h5>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                      <Mail size={10} /> Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser?.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      <p className="text-sm text-text">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-text-muted flex items-center gap-1 mb-1">
                      <Phone size={10} /> Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser?.phone || ""}
                        onChange={(e) => updateField("phone", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    ) : (
                      <p className="text-sm text-text">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Verification */}
              {isEditing && (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <h5 className="text-sm font-semibold text-text flex items-center gap-2">
                    <Shield size={14} className="text-primary" />
                    Status & Verification
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Status</label>
                      <select
                        value={editedUser?.status || ""}
                        onChange={(e) =>
                          updateField("status", e.target.value as "active" | "pending" | "suspended")
                        }
                        className="w-full px-3 py-2 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-muted mb-1 block">Verified</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedUser?.verified || false}
                          onChange={(e) => updateField("verified", e.target.checked)}
                          className="w-4 h-4 rounded border-white/40 text-primary focus:ring-primary/30"
                        />
                        <span className="text-sm text-text">User is verified</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Role-specific Information */}
              {isLandlord ? (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <h5 className="text-sm font-semibold text-text flex items-center gap-2">
                    <Building size={14} className="text-primary" />
                    Landlord Statistics
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <Home size={16} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">{landlord.totalRooms}</div>
                      <div className="text-xs text-text-muted">Rooms</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <Eye size={16} className="text-secondary mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">{landlord.totalViews}</div>
                      <div className="text-xs text-text-muted">Views</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <MessageCircle size={16} className="text-accent mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">{landlord.totalInquiries}</div>
                      <div className="text-xs text-text-muted">Inquiries</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <Star size={16} className="text-gold fill-gold mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">
                        {landlord.rating > 0 ? landlord.rating.toFixed(1) : "-"}
                      </div>
                      <div className="text-xs text-text-muted">
                        Rating ({landlord.reviewCount})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <MapPin size={14} />
                    <span>Area: {landlord.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Clock size={14} />
                    <span>Response Time: {landlord.responseTime}</span>
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-4 space-y-3">
                  <h5 className="text-sm font-semibold text-text flex items-center gap-2">
                    <Users size={14} className="text-secondary" />
                    Tenant Information
                  </h5>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-text-muted" />
                      <span className="text-text-muted">Age:</span>
                      <span className="text-text">{tenant.age} years</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase size={14} className="text-text-muted" />
                      <span className="text-text-muted">Occupation:</span>
                      <span className="text-text">{tenant.occupation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} className="text-text-muted" />
                      <span className="text-text-muted">Location:</span>
                      <span className="text-text">{tenant.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wallet size={14} className="text-text-muted" />
                      <span className="text-text-muted">Budget:</span>
                      <span className="text-text">
                        {formatCurrency(tenant.budgetMin)} - {formatCurrency(tenant.budgetMax)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-text-muted" />
                      <span className="text-text-muted">Move-in:</span>
                      <span className="text-text">
                        {new Date(tenant.moveInDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <Heart size={16} className="text-accent mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">{tenant.matchCount}</div>
                      <div className="text-xs text-text-muted">Matches</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/40">
                      <MessageCircle size={16} className="text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-text">{tenant.messagesCount}</div>
                      <div className="text-xs text-text-muted">Messages</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="glass rounded-2xl p-4 space-y-3">
                <h5 className="text-sm font-semibold text-text flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  Account Information
                </h5>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">Joined:</span>
                    <span className="text-text">
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">Last Active:</span>
                    <span className="text-text">
                      {new Date(user.lastActive).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 glass-strong px-6 py-4 border-t border-white/20 flex justify-end gap-3 rounded-b-3xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-white/40 bg-white/60 text-text text-sm font-medium hover:bg-white/80 transition-colors cursor-pointer"
              >
                {isEditing ? "Cancel" : "Close"}
              </motion.button>
              {isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-medium shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-0"
                >
                  <Save size={14} />
                  Save Changes
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
