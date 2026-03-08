import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, EyeOff, ArrowRight, Github, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthCard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-[480px] glass-card rounded-3xl shadow-2xl shadow-primary/5 p-8 relative overflow-hidden group">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />

      {/* Tab Switcher */}
      <div className="bg-slate-200/50 p-1 rounded-full flex mb-8 relative">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'login' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          {t('authCard.loginTab')}
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all duration-300 z-10 ${activeTab === 'register' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          {t('authCard.registerTab')}
        </button>
        <motion.div
          layoutId="tab-bg"
          className="absolute inset-y-1 bg-white rounded-full shadow-sm"
          initial={false}
          animate={{
            x: activeTab === 'login' ? '0%' : '100%',
            left: activeTab === 'login' ? '4px' : '-4px',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ width: 'calc(50% - 4px)' }}
        />
      </div>

      {/* Header Text */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          {activeTab === 'login' ? t('authCard.welcomeBack') : t('authCard.createAccount')}
        </h1>
        <p className="text-slate-500 text-sm">
          {activeTab === 'login'
            ? t('authCard.loginDesc')
            : t('authCard.registerDesc')}
        </p>
      </div>

      {/* Auth Form */}
      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold ml-2 text-slate-700" htmlFor="email">
            {t('authCard.emailLabel')}
          </label>
          <div className="relative group/input">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
              <Mail size={20} />
            </span>
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-full py-3.5 pl-11 pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 text-sm"
              id="email"
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              {t('authCard.passwordLabel')}
            </label>
            {activeTab === 'login' && (
              <a className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">
                {t('authCard.forgotPassword')}
              </a>
            )}
          </div>
          <div className="relative group/input">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-colors">
              <Lock size={20} />
            </span>
            <input
              className="w-full bg-white/50 border border-slate-200 rounded-full py-3.5 pl-11 pr-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-400 text-sm"
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              type="button"
            >
              <EyeOff size={20} />
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          className="mt-2 w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-3.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
          type="submit"
        >
          <span>{activeTab === 'login' ? t('authCard.signIn') : t('authCard.signUp')}</span>
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex py-8 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">
          {t('authCard.orContinueWith')}
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 hover:bg-slate-50 p-3 rounded-full transition-all shadow-sm">
          <img
            alt="Google"
            className="w-5 h-5"
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            referrerPolicy="no-referrer"
          />
          <span className="text-sm font-semibold text-slate-700">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white p-3 rounded-full transition-all shadow-sm shadow-blue-500/20">
          <Facebook size={20} fill="currentColor" />
          <span className="text-sm font-semibold">Facebook</span>
        </button>
      </div>

      {/* Toggle Auth Mode */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          {activeTab === 'login' ? t('authCard.noAccount') : t('authCard.hasAccount')}
          <button
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-primary font-bold hover:underline decoration-2 underline-offset-2"
          >
            {activeTab === 'login' ? t('authCard.signUpNow') : t('authCard.logIn')}
          </button>
        </p>
      </div>
    </div>
  );
}
