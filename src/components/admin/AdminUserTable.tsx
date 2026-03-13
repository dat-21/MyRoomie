import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Star,
  Building,
  Users,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  Home,
  MessageCircle,
  Heart,
} from "lucide-react";
import { formatCurrency } from "../../data/mockData";
import type { AdminLandlord, AdminTenant } from "../../data/adminData";

type UserType = AdminLandlord | AdminTenant;

interface AdminUserTableProps {
  users: UserType[];
  type: "landlord" | "tenant";
  onView: (user: UserType) => void;
  onEdit: (user: UserType) => void;
  onDelete: (user: UserType) => void;
  onApprove: (user: UserType) => void;
  onSuspend: (user: UserType) => void;
}

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
};

const statusIcons = {
  active: CheckCircle,
  pending: Clock,
  suspended: XCircle,
};

export default function AdminUserTable({
  users,
  type,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onSuspend,
}: AdminUserTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof UserType];
      const bValue = b[sortField as keyof UserType];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={`Search ${type}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-text-muted" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "pending" | "suspended")}
            className="px-4 py-2.5 rounded-xl border border-white/40 bg-white/60 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-text-muted">
        Showing {filteredUsers.length} of {users.length} {type}s
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th
                  className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide cursor-pointer hover:text-text transition-colors"
                  onClick={() => toggleSort("name")}
                >
                  <span className="flex items-center">
                    User <SortIcon field="name" />
                  </span>
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Contact
                </th>
                <th
                  className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide cursor-pointer hover:text-text transition-colors"
                  onClick={() => toggleSort("status")}
                >
                  <span className="flex items-center">
                    Status <SortIcon field="status" />
                  </span>
                </th>
                {type === "landlord" ? (
                  <>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Rooms
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Rating
                    </th>
                  </>
                ) : (
                  <>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Budget
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                      Matches
                    </th>
                  </>
                )}
                <th className="text-right py-4 px-4 text-xs font-semibold text-text-muted uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user, index) => {
                  const StatusIcon = statusIcons[user.status];
                  const isExpanded = expandedRow === user.id;
                  const isLandlord = type === "landlord";
                  const landlord = user as AdminLandlord;
                  const tenant = user as AdminTenant;

                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                      className={`border-b border-white/10 hover:bg-white/30 transition-colors ${
                        isExpanded ? "bg-white/20" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-xl object-cover bg-primary/10"
                            />
                            {user.verified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                                <BadgeCheck size={10} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-text flex items-center gap-2">
                              {user.name}
                              {isLandlord ? (
                                <Building size={12} className="text-primary" />
                              ) : (
                                <Users size={12} className="text-secondary" />
                              )}
                            </div>
                            <div className="text-xs text-text-muted flex items-center gap-1">
                              <MapPin size={10} />
                              {isLandlord ? landlord.area : tenant.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs text-text-muted space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone size={10} /> {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[user.status]
                          }`}
                        >
                          <StatusIcon size={12} />
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      {isLandlord ? (
                        <>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-text">
                              <Home size={14} className="text-primary" />
                              {landlord.totalRooms}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Star size={14} className="text-gold fill-gold" />
                              <span className="font-medium text-text">
                                {landlord.rating > 0 ? landlord.rating.toFixed(1) : "-"}
                              </span>
                              <span className="text-text-muted text-xs">
                                ({landlord.reviewCount})
                              </span>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-4">
                            <div className="text-xs text-text">
                              {formatCurrency(tenant.budgetMin)} - {formatCurrency(tenant.budgetMax)}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-text">
                              <Heart size={14} className="text-accent" />
                              {tenant.matchCount}
                            </div>
                          </td>
                        </>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setExpandedRow(isExpanded ? null : user.id)}
                            className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors cursor-pointer border-0"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onEdit(user)}
                            className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary hover:bg-secondary/20 transition-colors cursor-pointer border-0"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </motion.button>
                          {user.status === "pending" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onApprove(user)}
                              className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors cursor-pointer border-0"
                              title="Approve"
                            >
                              <CheckCircle size={14} />
                            </motion.button>
                          )}
                          {user.status === "active" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onSuspend(user)}
                              className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-700 hover:bg-yellow-200 transition-colors cursor-pointer border-0"
                              title="Suspend"
                            >
                              <AlertCircle size={14} />
                            </motion.button>
                          )}
                          {user.status === "suspended" && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onApprove(user)}
                              className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700 hover:bg-green-200 transition-colors cursor-pointer border-0"
                              title="Reactivate"
                            >
                              <CheckCircle size={14} />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(user)}
                            className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors cursor-pointer border-0"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-primary" />
          </div>
          <p className="text-text-muted">No {type}s found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
