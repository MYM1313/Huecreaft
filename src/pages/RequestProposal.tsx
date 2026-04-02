import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, ClipboardList, MessageCircle } from 'lucide-react';

const RequestProposal = () => {
  useEffect(() => {
    document.title = 'Transform My Space | Huecraft Luxury Services';
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-hidden selection:bg-luxury-gold/20 flex flex-col items-center justify-center pt-24 pb-16 gpu-accelerate">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-8">
        
        {/* PREMIUM ENTRY PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative group rounded-[2.5rem] md:rounded-[3rem] border border-luxury-divider bg-white p-8 md:p-12 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] text-center transition-all duration-500 overflow-hidden will-change-[opacity,transform,box-shadow]"
        >
          {/* Subtle top reflection */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent opacity-80" />
          
          <div className="relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-luxury-gold mb-4 block">
              Bespoke Solutions
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-luxury-ink leading-[1] mb-6">
              Transform My <span className="text-luxury-gold italic font-light">Space</span>
            </h1>
            
            <p className="mt-4 font-sans text-sm md:text-base font-light leading-relaxed text-luxury-gray max-w-md mx-auto">
              Tell us about your project and we'll create a custom plan just for you.
            </p>
            
            <div className="mt-8 mb-10">
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white border border-luxury-divider shadow-premium-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(197,148,63,0.4)]" />
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-luxury-ink/70">
                  Personalized Consultation Included
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/proposal-form"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center px-10 py-4 overflow-hidden rounded-xl btn-premium-navy active:scale-[0.97] tap-interaction"
              >
                <span className="relative z-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Transform My Space
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link
                to="/contact"
                className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl border-x border-t border-luxury-divider border-b-4 border-luxury-divider/50 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ink transition-all duration-200 hover:border-luxury-gold hover:text-luxury-gold hover:-translate-y-0.5 hover:border-b-[5px] bg-white active:translate-y-1 active:border-b-[1px] tap-interaction"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>

        {/* QUICK CONNECT PANEL: Compact Premium Decision Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-20 max-w-md mx-auto will-change-[opacity,transform]"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-luxury-divider/30 bg-white p-6 md:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.08)] text-center will-change-[transform,box-shadow]">
            {/* Subtle Texture/Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-blue-ultra/5 via-white to-luxury-gold/5 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold text-luxury-ink tracking-tight mb-6">
                How You Want to Get Started
              </h2>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                {/* CALL EXPERT BUTTON */}
                <motion.a
                  href="tel:+15558882424"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white border border-luxury-divider hover:border-luxury-gold/40 transition-all duration-500 overflow-hidden tap-interaction"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-11 w-11 rounded-xl bg-luxury-gold/10 flex items-center justify-center relative">
                      <Phone className="h-5 w-5 text-luxury-gold" />
                      {/* Continuous Pulse Effect */}
                      <div className="absolute inset-0 rounded-xl border border-luxury-gold/30 animate-ping opacity-20" />
                      <div className="absolute inset-0 rounded-xl bg-luxury-gold/5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink">Call Expert</p>
                      <p className="text-[9px] md:text-[10px] text-luxury-gray/50 font-light">Instant response</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-luxury-gold/30 group-hover:text-luxury-gold transition-all duration-500 group-hover:translate-x-1" />
                </motion.a>

                {/* WHATSAPP BUTTON */}
                <motion.a
                  href="https://wa.me/15558882424"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white border border-luxury-divider hover:border-[#25D366]/40 transition-all duration-500 overflow-hidden tap-interaction"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="h-11 w-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center relative">
                      <MessageCircle className="h-5 w-5 text-[#25D366]" />
                      {/* Continuous Pulse Effect */}
                      <div className="absolute inset-0 rounded-xl border border-[#25D366]/30 animate-ping opacity-20" />
                      <div className="absolute inset-0 rounded-xl bg-[#25D366]/5 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-luxury-ink">WhatsApp</p>
                      <p className="text-[9px] md:text-[10px] text-luxury-gray/50 font-light">Quick chat</p>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-[#25D366]/30 group-hover:text-[#25D366] transition-all duration-500 group-hover:translate-x-1" />
                </motion.a>
              </div>
            </div>
            
            {/* Subtle Bottom Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent opacity-40" />
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default RequestProposal;
