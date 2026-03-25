import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ChatPanel from "../components/ChatPanel";

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

export default function TenantLayout() {
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

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
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}
