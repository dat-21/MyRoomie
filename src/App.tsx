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

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function App() {
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar onChatOpen={() => setChatOpen(true)} />

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
              <Route path="/" element={<LandingPage />} />
              <Route path="/find" element={<FindRoommatePage />} />
              <Route path="/post" element={<PostRoomPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/design" element={<DesignSystemPage />} />
              <Route path="/rooms" element={<ViewAllRoomsPage />} />
              <Route path="/matches" element={<ViewAllMatchesPage />} />
              <Route path="/premium" element={<PremiumPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Chat Panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
