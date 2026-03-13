import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building,
  Users,
  Star,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "landlords", label: "Landlords", icon: Building },
  { id: "tenants", label: "Tenants", icon: Users },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: AdminSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen glass-strong border-r border-white/20 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/20">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-bold">M</span>
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-text font-[family-name:var(--font-family-heading)]"
            >
              MyRoomie
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border-0 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
                  : "bg-transparent text-text-muted hover:bg-white/50 hover:text-text"
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <Link to="/">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-text-muted hover:bg-white/50 hover:text-text transition-all cursor-pointer border-0 bg-transparent"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!collapsed && <span>Exit Admin</span>}
          </motion.button>
        </Link>
      </div>

      {/* Collapse Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg cursor-pointer border-0"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </motion.button>
    </motion.aside>
  );
}
