import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Vercel deployment trigger
// Pages
import RoleSelectionPage from "./pages/RoleSelectionPage";
import LandingPage from "./pages/LandingPage";
import FindRoommatePage from "./pages/FindRoommatePage";
import PostRoomPage from "./pages/PostRoomPage";
import ProfilePage from "./pages/ProfilePage";
import DesignSystemPage from "./pages/DesignSystemPage";
import ViewAllRoomsPage from "./pages/ViewAllRoomsPage";
import RoomDetailPage from "./pages/RoomDetailPage";

import PremiumPage from "./pages/PremiumPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandlordHomePage from "./pages/LandlordHomePage";
import LandlordRoomsPage from "./pages/LandlordRoomsPage";
import LandlordPremiumPage from "./pages/LandlordPremiumPage";
import AdminPage from "./pages/AdminPage";
import UserDetailPage from "./pages/UserDetailPage";

// Layouts
import TenantLayout from "./layouts/TenantLayout";
import LandlordLayout from "./layouts/LandlordLayout";

import { useAuth } from "./contexts/AuthContext";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedStandalonePage({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isLandlord = user?.role === "landlord";
  const isTenant = user?.role === "tenant";
  const isLoggedIn = !!user;

  return (
    <Routes>
      {/* Auth & Admin Routes */}
      <Route path="/login" element={<AnimatedStandalonePage><LoginPage /></AnimatedStandalonePage>} />
      <Route path="/register" element={<AnimatedStandalonePage><RegisterPage /></AnimatedStandalonePage>} />
      <Route
        path="/admin"
        element={
          <AnimatedStandalonePage>
            {isAdmin ? <AdminPage /> : <Navigate to="/login" replace />}
          </AnimatedStandalonePage>
        }
      />

      {/* ═══ Admin Routes ═══ */}
      {isAdmin && (
        <>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </>
      )}

      {/* ═══ Landlord Routes ═══ */}
      {isLandlord && (
        <Route element={<LandlordLayout />}>
          <Route path="/" element={<LandlordHomePage />} />
          <Route path="/post" element={<PostRoomPage />} />
          <Route path="/rooms" element={<LandlordRoomsPage />} />
          <Route path="/explore" element={<ViewAllRoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/user/:id" element={<UserDetailPage />} />
          <Route path="/premium" element={<LandlordPremiumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}

      {/* ═══ Tenant Routes ═══ */}
      {isTenant && (
        <Route element={<TenantLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find" element={<FindRoommatePage />} />
          <Route path="/post" element={<PostRoomPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/design" element={<DesignSystemPage />} />
          <Route path="/rooms" element={<ViewAllRoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/matches" element={<Navigate to="/find" replace />} />
          <Route path="/user/:id" element={<UserDetailPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}

      {/* ═══ Unauthenticated — Role Selection Homepage ═══ */}
      {!isLoggedIn && (
        <Route element={<TenantLayout />}>
          <Route path="/" element={<RoleSelectionPage />} />
          <Route path="/rooms" element={<ViewAllRoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  );
}
