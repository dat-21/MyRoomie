import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import FindRoommatePage from "./pages/FindRoommatePage";
import PostRoomPage from "./pages/PostRoomPage";
import ProfilePage from "./pages/ProfilePage";

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

export default function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col bg-bg">
            <Navbar />

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
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
