import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandlordSidebar from "../components/LandlordSidebar";

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
};

export default function LandlordLayout() {
    const [chatOpen, setChatOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <LandlordSidebar onChatOpen={() => setChatOpen(true)} />
            
            <main className="flex-1 md:ml-64 pt-20 md:pt-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="h-full p-6 md:p-8 lg:p-10"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
