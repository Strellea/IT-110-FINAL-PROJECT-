import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Heart,
  LayoutDashboard,
  Compass,
  ChevronDown
} from "lucide-react";

export default function Header({ auth }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <span className="text-black font-bold text-xl">C</span>
                
                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-amber-300 rounded-tl-sm" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-amber-300 rounded-tr-sm" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-amber-300 rounded-bl-sm" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-amber-300 rounded-br-sm" />
              </motion.div>
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Chronicles
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Art Through Time</p>
              </div>
            </Link>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {!auth?.user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-5 py-2 text-white hover:text-amber-300 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/30 transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/50 rounded-lg transition-all group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-sm">
                      {auth.user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-white font-medium">
                      {auth.user.name}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {/* User Info */}
                          <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-white/10">
                            <p className="text-white font-semibold">{auth.user.name}</p>
                            <p className="text-gray-400 text-sm">{auth.user.email}</p>
                          </div>

                          {/* Menu Items */}
                          <div className="p-2">
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard size={18} className="text-blue-400" />
                              <span>Dashboard</span>
                            </Link>

                            <Link
                              href="/collection"
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Heart size={18} className="text-pink-400" />
                              <span>My Collection</span>
                            </Link>

                            <Link
                              href="/profile"
                              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings size={18} className="text-purple-400" />
                              <span>Profile</span>
                            </Link>
                          </div>

                          {/* Logout */}
                          <div className="p-2 border-t border-white/10">
                            <Link
                              href="/logout"
                              method="post"
                              as="button"
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LogOut size={18} />
                              <span>Logout</span>
                            </Link>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/20"
            >
              <div className="px-4 py-4 space-y-2">

                {!auth?.user ? (
                  <>
                    <Link
                      href="/login"
                      className="block w-full px-4 py-3 text-center text-white hover:bg-white/10 rounded-lg transition-all font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="pt-4 border-t border-white/10">
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings size={20} className="text-purple-400" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogOut size={20} />
                        <span>Logout</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-20" />
    </>
  );
}