import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building,
  Home,
  TrendingUp,
  MessageCircle,
  UserCheck,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Flag,
} from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminStatsCard from "../components/admin/AdminStatsCard";
import AdminUserTable from "../components/admin/AdminUserTable";
import AdminUserModal from "../components/admin/AdminUserModal";
import {
  adminStats,
  adminLandlords,
  adminTenants,
  adminReviews,
  type AdminLandlord,
  type AdminTenant,
  type AdminReview,
} from "../data/adminData";

type UserType = AdminLandlord | AdminTenant;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userType, setUserType] = useState<"landlord" | "tenant">("landlord");

  // Local state for data (in real app, this would come from API)
  const [landlords, setLandlords] = useState(adminLandlords);
  const [tenants, setTenants] = useState(adminTenants);
  const [reviews, setReviews] = useState(adminReviews);

  const handleView = (user: UserType) => {
    setSelectedUser(user);
    setModalMode("view");
    setUserType(user.role);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setModalMode("edit");
    setUserType(user.role);
    setIsModalOpen(true);
  };

  const handleDelete = (user: UserType) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      if (user.role === "landlord") {
        setLandlords(landlords.filter((l) => l.id !== user.id));
      } else {
        setTenants(tenants.filter((t) => t.id !== user.id));
      }
    }
  };

  const handleApprove = (user: UserType) => {
    if (user.role === "landlord") {
      setLandlords(
        landlords.map((l) =>
          l.id === user.id ? { ...l, status: "active" as const } : l
        )
      );
    } else {
      setTenants(
        tenants.map((t) =>
          t.id === user.id ? { ...t, status: "active" as const } : t
        )
      );
    }
  };

  const handleSuspend = (user: UserType) => {
    if (user.role === "landlord") {
      setLandlords(
        landlords.map((l) =>
          l.id === user.id ? { ...l, status: "suspended" as const } : l
        )
      );
    } else {
      setTenants(
        tenants.map((t) =>
          t.id === user.id ? { ...t, status: "suspended" as const } : t
        )
      );
    }
  };

  const handleSaveUser = (user: UserType) => {
    if (user.role === "landlord") {
      setLandlords(
        landlords.map((l) => (l.id === user.id ? (user as AdminLandlord) : l))
      );
    } else {
      setTenants(
        tenants.map((t) => (t.id === user.id ? (user as AdminTenant) : t))
      );
    }
  };

  const handleReviewAction = (review: AdminReview, action: "hide" | "show" | "delete") => {
    if (action === "delete") {
      if (confirm("Are you sure you want to delete this review?")) {
        setReviews(reviews.filter((r) => r.id !== review.id));
      }
    } else {
      setReviews(
        reviews.map((r) =>
          r.id === review.id
            ? { ...r, status: action === "hide" ? "hidden" : "visible" }
            : r
        )
      );
    }
  };

  const pendingLandlords = landlords.filter((l) => l.status === "pending").length;
  const pendingTenants = tenants.filter((t) => t.status === "pending").length;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent stats={adminStats} pendingLandlords={pendingLandlords} pendingTenants={pendingTenants} />;
      case "landlords":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                Landlord Management
              </h2>
              <p className="text-text-muted text-sm mt-1">
                Manage all landlord accounts, verify listings, and handle approvals
              </p>
            </div>
            <AdminUserTable
              users={landlords}
              type="landlord"
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onSuspend={handleSuspend}
            />
          </div>
        );
      case "tenants":
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
                Tenant Management
              </h2>
              <p className="text-text-muted text-sm mt-1">
                Manage tenant accounts, view activity, and handle verifications
              </p>
            </div>
            <AdminUserTable
              users={tenants}
              type="tenant"
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onApprove={handleApprove}
              onSuspend={handleSuspend}
            />
          </div>
        );
      case "reviews":
        return <ReviewsContent reviews={reviews} onAction={handleReviewAction} />;
      case "settings":
        return <SettingsContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <div className="p-6 sm:p-8">{renderContent()}</div>
      </main>

      <AdminUserModal
        user={selectedUser}
        type={userType}
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}

/* ─── Dashboard Content ─── */
function DashboardContent({
  stats,
  pendingLandlords,
  pendingTenants,
}: {
  stats: typeof adminStats;
  pendingLandlords: number;
  pendingTenants: number;
}) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-family-heading)]">
          Admin Dashboard
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Welcome back! Here's what's happening with MyRoomie today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Users}
          value={stats.totalUsers.toLocaleString()}
          label="Total Users"
          trend={stats.monthlyGrowth}
          color="from-primary to-primary-light"
          delay={0}
        />
        <AdminStatsCard
          icon={Building}
          value={stats.totalLandlords}
          label="Landlords"
          color="from-secondary to-secondary-light"
          delay={0.1}
        />
        <AdminStatsCard
          icon={Users}
          value={stats.totalTenants}
          label="Tenants"
          color="from-accent to-accent-light"
          delay={0.2}
        />
        <AdminStatsCard
          icon={Clock}
          value={stats.pendingApprovals}
          label="Pending Approvals"
          color="from-yellow-500 to-yellow-400"
          delay={0.3}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Home}
          value={stats.totalRooms}
          label="Total Rooms"
          color="from-primary-dark to-primary"
          delay={0.4}
        />
        <AdminStatsCard
          icon={CheckCircle}
          value={stats.activeRooms}
          label="Active Listings"
          color="from-green-500 to-green-400"
          delay={0.5}
        />
        <AdminStatsCard
          icon={TrendingUp}
          value={stats.totalMatches.toLocaleString()}
          label="Total Matches"
          color="from-secondary-dark to-secondary"
          delay={0.6}
        />
        <AdminStatsCard
          icon={MessageCircle}
          value={stats.totalMessages.toLocaleString()}
          label="Messages Sent"
          color="from-accent-dark to-accent"
          delay={0.7}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2 mb-4">
            <UserCheck size={20} className="text-primary" />
            Pending Approvals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40">
              <div className="flex items-center gap-3">
                <Building size={18} className="text-primary" />
                <span className="text-sm text-text">Landlord Applications</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                {pendingLandlords}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-secondary" />
                <span className="text-sm text-text">Tenant Applications</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                {pendingTenants}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/40">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-text">New landlord registered</p>
                <p className="text-xs text-text-muted">Tuan Nguyen - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/40">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Home size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-text">New room listing created</p>
                <p className="text-xs text-text-muted">Premium Penthouse - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/40">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Star size={14} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-text">New review submitted</p>
                <p className="text-xs text-text-muted">5-star review for Minh Tran - 1 day ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Reviews Content ─── */
function ReviewsContent({
  reviews,
  onAction,
}: {
  reviews: AdminReview[];
  onAction: (review: AdminReview, action: "hide" | "show" | "delete") => void;
}) {
  const statusColors = {
    visible: "bg-green-100 text-green-700",
    hidden: "bg-gray-100 text-gray-700",
    flagged: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
          Review Management
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Monitor and moderate user reviews across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-text">
              {reviews.filter((r) => r.status === "visible").length}
            </div>
            <div className="text-xs text-text-muted">Visible Reviews</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Flag size={20} className="text-red-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-text">
              {reviews.filter((r) => r.status === "flagged").length}
            </div>
            <div className="text-xs text-text-muted">Flagged Reviews</div>
          </div>
        </div>
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Star size={20} className="text-yellow-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-text">
              {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
            </div>
            <div className="text-xs text-text-muted">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="space-y-0">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 border-b border-white/10 last:border-0 ${
                review.status === "hidden" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={review.reviewerAvatar}
                  alt={review.reviewerName}
                  className="w-10 h-10 rounded-xl object-cover bg-primary/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text">{review.reviewerName}</span>
                    <span className="text-xs text-text-muted">reviewed</span>
                    <span className="text-sm font-semibold text-text">{review.targetName}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        review.targetRole === "landlord"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {review.targetRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= review.rating
                              ? "text-gold fill-gold"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">{review.date}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-light mt-2 leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {review.status === "visible" ? (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onAction(review, "hide")}
                      className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer border-0"
                      title="Hide Review"
                    >
                      <Eye size={14} />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onAction(review, "show")}
                      className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors cursor-pointer border-0"
                      title="Show Review"
                    >
                      <CheckCircle size={14} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAction(review, "delete")}
                    className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors cursor-pointer border-0"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Settings Content ─── */
function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-family-heading)]">
          Admin Settings
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] mb-4">
            General Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40">
              <div>
                <div className="text-sm font-medium text-text">Enable New User Registrations</div>
                <div className="text-xs text-text-muted">Allow new users to register on the platform</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40">
              <div>
                <div className="text-sm font-medium text-text">Require Email Verification</div>
                <div className="text-xs text-text-muted">New users must verify their email before accessing features</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40">
              <div>
                <div className="text-sm font-medium text-text">Auto-approve Landlords</div>
                <div className="text-xs text-text-muted">Automatically approve new landlord registrations</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/20">
          <h3 className="text-lg font-semibold text-text font-[family-name:var(--font-family-heading)] mb-4">
            Moderation Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40">
              <div>
                <div className="text-sm font-medium text-text">Enable Review Moderation</div>
                <div className="text-xs text-text-muted">Require admin approval for new reviews</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/40">
              <div>
                <div className="text-sm font-medium text-text">Auto-flag Low Ratings</div>
                <div className="text-xs text-text-muted">Automatically flag reviews with 2 stars or below</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
