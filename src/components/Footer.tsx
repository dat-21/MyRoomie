import { Link } from "react-router-dom";
import { Heart, Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

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
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 list-none p-0 m-0">
                            <li><Link to="/" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.home')}</Link></li>
                            <li><Link to="/find" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.findRoommate')}</Link></li>
                            <li><Link to="/post" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.postRoomSlot')}</Link></li>
                            <li><Link to="/profile" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.myProfile')}</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">{t('footer.support')}</h4>
                        <ul className="space-y-2 list-none p-0 m-0">
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.faq')}</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.safetyTips')}</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.communityGuidelines')}</a></li>
                            <li><a href="#" className="text-sm text-white/60 hover:text-secondary transition-colors no-underline">{t('footer.contactUs')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-family-heading)]">{t('footer.getInTouch')}</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Mail size={16} className="text-secondary" />
                                hello@myroomie.vn
                            </div>
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <MapPin size={16} className="text-secondary" />
                                {t('footer.address')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/40">
                        {t('footer.copyright')}
                    </p>
                    <p className="text-sm text-white/40 flex items-center gap-1">
                        {t('footer.madeWith')} <Heart size={14} className="text-accent fill-accent" /> {t('footer.inDaNang')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
