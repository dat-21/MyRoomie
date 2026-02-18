import { Link } from "react-router-dom";
import { Heart, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-text text-white/80 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold text-sm">MR</span>
                            </div>
                            <span className="text-xl font-bold text-white font-[family-name:var(--font-family-heading)]">
                                My Roomie
                            </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                            Find your perfect roommate based on lifestyle compatibility, not just budget.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">Quick Links</h4>
                        <ul className="space-y-2 list-none p-0 m-0">
                            <li><Link to="/" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Home</Link></li>
                            <li><Link to="/find" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Find Roommate</Link></li>
                            <li><Link to="/post" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Post Room Slot</Link></li>
                            <li><Link to="/profile" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">My Profile</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">Support</h4>
                        <ul className="space-y-2 list-none p-0 m-0">
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">FAQ</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Safety Tips</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Community Guidelines</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">Get In Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Mail size={16} className="text-secondary" />
                                hello@myroomie.vn
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <MapPin size={16} className="text-secondary" />
                                Da Nang, Vietnam
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        © 2026 My Roomie. All rights reserved.
                    </p>
                    <p className="text-sm text-white/40 flex items-center gap-1">
                        Made with <Heart size={14} className="text-accent fill-accent" /> in Da Nang
                    </p>
                </div>
            </div>
        </footer>
    );
}
