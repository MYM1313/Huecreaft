import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Phone, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const utilityLinks = [
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Support', path: '/contact' },
  ];

  return (
    <footer className="relative bg-white text-luxury-ink overflow-hidden border-t border-luxury-divider gpu-accelerate">
      {/* Subtle Background Tint */}
      <div className="absolute inset-0 bg-luxury-blue-ultra/10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8 lg:py-12 relative z-10 mt-[12px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="inline-flex items-center gap-3 group mb-4 lg:mb-6">
                <img 
                  src="https://ik.imagekit.io/jabzmiuta/Gemini_Generated_Image_6tlhjt6tlhjt6tlh-removebg-preview.png" 
                  alt="Huecraft Logo" 
                  className="h-10 lg:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <span className="text-2xl lg:text-3xl font-serif font-bold tracking-tighter text-luxury-blue-mid group-hover:text-luxury-gold transition-colors duration-500">
                  HUECRAFT
                </span>
              </Link>
              <p className="text-sm lg:text-base font-light text-luxury-gray tracking-tight max-w-xs lg:max-w-sm leading-relaxed lg:leading-loose">
                Precision in every stroke, luxury in every detail. Elevating spaces through master-level craftsmanship and refined aesthetics.
              </p>
            </motion.div>
          </div>

          {/* 2. Navigation & 3. Quick Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-luxury-blue-mid">Navigation</h4>
              <ul className="space-y-3 lg:space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="group flex items-center gap-2 text-sm lg:text-base font-light text-luxury-gray hover:text-luxury-blue-mid transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold/40 group-hover:w-full transition-all duration-500" />
                      </span>
                      <ArrowUpRight className="w-3 lg:w-4 h-3 lg:h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 text-luxury-gold" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-luxury-blue-mid">Utility</h4>
              <ul className="space-y-3 lg:space-y-4">
                {utilityLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="group text-sm lg:text-base font-light text-luxury-gray hover:text-luxury-blue-mid transition-colors duration-300"
                    >
                      <span className="relative overflow-hidden">
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-luxury-gold/40 group-hover:w-full transition-all duration-500" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Contact Section */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <h4 className="text-[10px] lg:text-xs font-black uppercase tracking-[0.3em] text-luxury-blue-mid">Get in Touch</h4>
            <div className="space-y-3 lg:space-y-4">
              <motion.a 
                href="mailto:concierge@huecraft.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 lg:gap-5 group"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-luxury-blue-ultra border border-luxury-divider flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-white transition-all duration-500 inner-highlight shrink-0">
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-luxury-blue-mid group-hover:text-luxury-gold transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] lg:text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Email</span>
                  <span className="text-sm lg:text-base font-light text-luxury-gray group-hover:text-luxury-blue-mid transition-colors">concierge@huecraft.com</span>
                </div>
              </motion.a>

              <motion.a 
                href="tel:+15551234567"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 lg:gap-5 group"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-luxury-blue-ultra border border-luxury-divider flex items-center justify-center group-hover:border-luxury-gold/50 group-hover:bg-white transition-all duration-500 inner-highlight shrink-0">
                  <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-luxury-blue-mid group-hover:text-luxury-gold transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] lg:text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Phone</span>
                  <span className="text-sm lg:text-base font-light text-luxury-gray group-hover:text-luxury-blue-mid transition-colors">+1 (555) 123-4567</span>
                </div>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 lg:mt-16 pt-8 lg:pt-10 border-t border-luxury-divider flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs lg:text-sm text-luxury-gray font-light">
            &copy; {currentYear} Huecraft Corp. All rights reserved.
          </p>
          <div className="flex items-center gap-6 lg:gap-8">
            <Link to="#" className="text-xs lg:text-sm text-luxury-gray hover:text-luxury-gold transition-colors">Privacy</Link>
            <Link to="#" className="text-xs lg:text-sm text-luxury-gray hover:text-luxury-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
