import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatPanel from "./components/ChatPanel";
import LandingPage from "./pages/LandingPage";
import FindRoommatePage from "./pages/FindRoommatePage";
import PostRoomPage from "./pages/PostRoomPage";
import ProfilePage from "./pages/ProfilePage";
import DesignSystemPage from "./pages/DesignSystemPage";
import ViewAllRoomsPage from "./pages/ViewAllRoomsPage";
import ViewAllMatchesPage from "./pages/ViewAllMatchesPage";
import PremiumPage from "./pages/PremiumPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandlordHomePage from "./pages/LandlordHomePage";
import { useAuth } from "./contexts/AuthContext";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function App() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();

  const isAuthPage = ["login", "register"].includes(location.pathname.replace("/", ""));
  const isLandlord = user?.role === "landlord";

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {!isAuthPage && <Navbar onChatOpen={() => setChatOpen(true)} />}

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
            <Routes location={location}>
              <Route path="/" element={isLandlord ? <LandlordHomePage /> : <LandingPage />} />
              <Route path="/find" element={<FindRoommatePage />} />
              <Route path="/post" element={<PostRoomPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/design" element={<DesignSystemPage />} />
              <Route path="/rooms" element={<ViewAllRoomsPage />} />
              <Route path="/matches" element={<ViewAllMatchesPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && <Footer />}

      {/* Global Chat Panel */}
      {!isAuthPage && <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
