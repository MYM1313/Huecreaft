import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import MobileMenu from './MobileMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Transform My Space', path: '/request-proposal' },
    { name: 'Contact', path: '/contact' },
    { name: 'About', path: '/about' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b rounded-b-2xl backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.1)]',
          scrolled 
            ? 'bg-white/90 py-0.5 border-luxury-divider/50' 
            : 'bg-white/60 py-1.5 border-luxury-divider/20'
        )}
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
          <div className="relative flex items-center justify-between h-12 sm:h-14">
            {/* Left: Logo & Desktop Brand Name */}
            <div className="flex-shrink-0 z-20 -ml-3 sm:-ml-5 lg:-ml-7 flex items-center gap-3 lg:gap-4">
              <Link to="/" className="group block">
                <motion.img 
                  animate={{ height: scrolled ? "32px" : "44px" }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.4, ease: "easeOut" } }}
                  whileTap={{ scale: 0.98 }}
                  src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                  alt="Huecraft Logo" 
                  className="ml-[7px] w-auto object-contain transition-all duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <Link to="/" className="hidden md:block group">
                <motion.div
                  animate={{ scale: scrolled ? 0.85 : 1 }}
                  whileHover={{ y: -1, transition: { duration: 0.3, ease: "easeOut" } }}
                  className="flex flex-col items-center origin-left"
                >
                  <span className="text-xl lg:text-2xl xl:text-3xl font-serif font-black tracking-[0.25em] text-luxury-blue-mid uppercase leading-none transition-colors duration-300 group-hover:text-luxury-gold">
                    HUECRAFT
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Center: Mobile Brand Name */}
            <div className="absolute inset-0 flex md:hidden items-center justify-center pointer-events-none z-10">
              <Link to="/" className="pointer-events-auto group flex flex-col items-center">
                <motion.div
                  animate={{ scale: scrolled ? 0.85 : 1 }}
                  whileHover={{ y: -1, transition: { duration: 0.3, ease: "easeOut" } }}
                  className="flex flex-col items-center origin-center"
                >
                  <span className="text-xl font-serif font-black tracking-[0.25em] text-luxury-blue-mid uppercase leading-none transition-colors duration-300 group-hover:text-luxury-gold">
                    HUECRAFT
                  </span>
                </motion.div>
              </Link>
            </div>

            {/* Right: Desktop Navigation / Mobile Toggle */}
            <div className="flex items-center justify-end z-10">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-1 lg:gap-2">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to={link.path}
                        className={cn(
                          'group relative px-4 py-2 lg:px-5 lg:py-2.5 text-[10px] lg:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300',
                          location.pathname === link.path 
                            ? 'text-luxury-blue-mid' 
                            : 'text-luxury-gray hover:text-luxury-gold'
                        )}
                      >
                        <span className="relative z-10">{link.name}</span>
                        <span className={cn(
                          "absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-luxury-gold transition-all duration-300",
                          location.pathname === link.path ? "w-1/3 opacity-100" : "w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-100"
                        )} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <div className="ml-4 pl-4 lg:ml-6 lg:pl-6 border-l border-luxury-divider">
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/request-proposal"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full btn-premium-navy px-6 py-2 lg:px-7 lg:py-2.5 text-[9px] lg:text-[10px] font-black uppercase tracking-[0.25em]"
                    >
                      <span className="relative z-10">Transform My Space</span>
                      <div className="absolute inset-0 translate-y-full bg-luxury-blue-soft transition-transform duration-500 group-hover:translate-y-0" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* Mobile Menu Toggle - Premium Light Mode Icon */}
              <div className="md:hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white border border-luxury-divider text-luxury-blue-mid transition-all duration-300 hover:border-luxury-gold/30"
                  aria-label="Toggle Menu"
                >
                  <Menu className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Premium Mobile Menu Panel */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default Navbar;
