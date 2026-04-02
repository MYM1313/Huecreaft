import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { FinalCTA } from '../components/FinalCTA';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  serviceType: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Project details must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

const FadeInWhenVisible: React.FC<{ children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }> = ({ 
  children, 
  delay = 0, 
  direction = 'up' 
}) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 10 : direction === 'down' ? -10 : 0,
      x: direction === 'left' ? 10 : direction === 'right' ? -10 : 0
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className="will-change-[opacity,transform]"
    >
      {children}
    </motion.div>
  );
};

const services = [
  "Interior Painting",
  "Exterior Painting",
  "Commercial Renovation",
  "Residential Construction",
  "Custom Cabinetry",
  "Other"
];

const PremiumInput = ({ 
  label, 
  name, 
  register, 
  error, 
  type = "text", 
  isTextArea = false,
  isSelect = false,
  options = []
}: { 
  label: string; 
  name: keyof ContactForm; 
  register: any; 
  error?: string; 
  type?: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: string[];
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full group">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ink/60 mb-2 ml-1">
        {label}
      </label>
      <motion.div
        animate={{
          y: isFocused ? -2 : 0,
        }}
        className={cn(
          "relative rounded-2xl border transition-all duration-500 luxury-easing bg-white/30 backdrop-blur-sm will-change-transform",
          isFocused ? "border-luxury-gold ring-4 ring-luxury-gold/5 bg-white shadow-premium-md" : "border-luxury-divider/50",
          error ? "border-red-400/50 ring-red-400/5" : ""
        )}
      >
        {isFocused && (
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-luxury-gold shadow-[0_0_10px_rgba(197,148,63,0.3)]" />
        )}
        {isSelect ? (
          <div className="relative">
            <select
              {...register(name)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a service</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-luxury-gold pointer-events-none" />
          </div>
        ) : isTextArea ? (
          <textarea
            {...register(name)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none min-h-[80px] resize-none placeholder:text-luxury-gray/30"
            placeholder={`Tell us about your project...`}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 py-2.5 text-[13px] text-luxury-ink outline-none placeholder:text-luxury-gray/30"
            placeholder={label}
          />
        )}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute -bottom-5 left-1 text-[9px] font-bold uppercase tracking-widest text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);

  // Removed parallax for better performance
  const rotateX = 0;
  const rotateY = 0;
  const infoRotateX = 0;
  const infoRotateY = 0;
  const infoTranslateZ = 0;

  const handleMouseMove = () => {};
  const handleInfoMouseMove = () => {};
  const handleMouseLeave = () => {};
  const handleInfoMouseLeave = () => {};

  useEffect(() => {
    document.title = 'Contact | Huecraft Luxury Services';
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      serviceType: ""
    }
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `[Service: ${data.serviceType}] ${data.message}`
      }]);
      if (error) throw error;
      setIsSuccess(true);
      toast.success('Consultation request received.');
      reset();
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden selection:bg-luxury-gold/20 gpu-accelerate">
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-20 lg:px-8">
        
        {/* HERO SECTION */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-luxury-gold bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-luxury-divider/40 shadow-premium-sm edge-highlight mb-5 inline-block">
              Connect With Us
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tighter text-luxury-ink leading-[1] mb-5">
              Let's Start Your <br className="hidden sm:block" />
              <span className="text-luxury-gold italic font-light drop-shadow-sm">Transformation.</span>
            </h1>
            <p className="mt-4 font-sans text-sm md:text-base font-light leading-relaxed text-luxury-gray/80 max-w-xl mx-auto">
              Whether you have a specific project in mind or need expert guidance, 
              our team is ready to deliver excellence.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          
          {/* MAIN FORM (CENTERPIECE) */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              ref={formCardRef}
              className="relative"
            >
              <div className="relative z-10 overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-luxury-divider/50 bg-white p-8 md:p-16 shadow-premium-xl transition-all duration-700 luxury-easing edge-highlight">
                
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner"
                      >
                        <CheckCircle2 className="h-10 w-10" />
                      </motion.div>
                      <h3 className="font-serif text-2xl md:text-4xl font-bold text-luxury-ink mb-3">Transformation Request Received</h3>
                      <p className="text-base text-luxury-gray font-light max-w-md leading-relaxed">
                        Your transformation journey has begun. Our specialists will contact you within 24 hours.
                      </p>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="mt-8 group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold hover:text-luxury-ink transition-all"
                      >
                        Send Another Request
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                      </button>
                    </motion.div>
                  ) : (
                    <form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
                      <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
                        <PremiumInput 
                          label="Full Name" 
                          name="name" 
                          register={register} 
                          error={errors.name?.message} 
                        />
                        <PremiumInput 
                          label="Phone Number" 
                          name="phone" 
                          type="tel"
                          register={register} 
                          error={errors.phone?.message} 
                        />
                      </div>

                      <div className="grid gap-6 md:gap-8 sm:grid-cols-2">
                        <PremiumInput 
                          label="Email Address" 
                          name="email" 
                          type="email"
                          register={register} 
                          error={errors.email?.message} 
                        />
                        <PremiumInput 
                          label="Service Type" 
                          name="serviceType" 
                          isSelect
                          options={services}
                          register={register} 
                          error={errors.serviceType?.message} 
                        />
                      </div>

                      <PremiumInput 
                        label="Project Details" 
                        name="message" 
                        isTextArea
                        register={register} 
                        error={errors.message?.message} 
                      />

                      <div className="pt-4">
                        <motion.button
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl btn-premium-navy py-4 md:py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] disabled:opacity-50 tap-interaction"
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          {isSubmitting ? (
                            <Loader2 className="relative z-10 h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              <span className="relative z-10">Transform My Space</span>
                              <Send className="relative z-10 h-4 w-4 transition-transform duration-700 luxury-easing group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* SIDE INFO PANEL - Now below the form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              ref={infoPanelRef}
              className="relative group/panel"
            >
              <div className="relative z-10 overflow-hidden rounded-[1.5rem] border border-luxury-divider/20 bg-white p-6 md:p-8 shadow-premium-lg transition-all duration-700 luxury-easing edge-highlight will-change-[transform,box-shadow] h-full">
                <div className="relative z-10 space-y-6 md:space-y-8 flex flex-col h-full">
                  <div className="flex-grow">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-6 block">
                      Immediate Assistance
                    </span>
                    <div className="space-y-5 md:space-y-6">
                      <div className="flex items-center gap-5 group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/30 shadow-premium-sm border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:shadow-premium-md group-hover:-translate-y-0.5">
                          <Phone className="h-4 w-4 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-luxury-gray mb-0.5">Phone</p>
                          <p className="text-sm font-bold text-luxury-ink font-serif">+1 (555) 888-2424</p>
                        </div>
                      </div>

                      <a 
                        href="https://wa.me/15558882424" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-5 group"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/30 shadow-premium-sm border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-[#25D366] group-hover:text-white group-hover:shadow-premium-md group-hover:-translate-y-0.5">
                          <MessageCircle className="h-4 w-4 text-[#25D366] group-hover:text-white transition-colors duration-700" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-luxury-gray mb-0.5">WhatsApp</p>
                          <p className="text-sm font-bold text-luxury-ink font-serif">Instant Chat</p>
                        </div>
                      </a>
 
                      <div className="flex items-center gap-5 group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/30 shadow-premium-sm border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:shadow-premium-md group-hover:-translate-y-0.5">
                          <Mail className="h-4 w-4 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-luxury-gray mb-0.5">Email</p>
                          <p className="text-sm font-bold text-luxury-ink font-serif">concierge@huecraft.com</p>
                        </div>
                      </div>
 
                      <div className="flex items-center gap-5 group">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/30 shadow-premium-sm border border-luxury-divider/40 transition-all duration-700 luxury-easing group-hover:bg-luxury-gold group-hover:text-white group-hover:shadow-premium-md group-hover:-translate-y-0.5">
                          <MapPin className="h-4 w-4 text-luxury-gold group-hover:text-white transition-colors duration-700" />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-luxury-gray mb-0.5">Location</p>
                          <p className="text-sm font-bold text-luxury-ink font-serif">Calgary, AB, Canada</p>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  <div className="pt-6 border-t border-luxury-divider/10 mt-auto">
                    <div className="flex items-center gap-3 text-luxury-gold">
                      <div className="h-1.5 w-1.5 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_8px_rgba(197,148,63,0.4)]" />
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em]">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SERVICE REGIONS PANEL */}
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                y: [0, -10, 0],
                rotateX: [0, 2, 0],
                rotateY: [0, -2, 0]
              }}
              transition={{ 
                opacity: { duration: 0.6 },
                x: { duration: 0.6 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative bg-white rounded-[3rem] p-8 md:p-10 border border-luxury-divider shadow-premium-xl hover:shadow-[0_50px_100px_-20px_rgba(26,46,71,0.15)] transition-all duration-700 overflow-hidden group will-change-[transform,box-shadow] h-full flex flex-col perspective-2000"
            >
              {/* 3D Lighting/Shading */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-transparent to-white/40 pointer-events-none" />
              
              {/* Subtle top reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/40 to-transparent opacity-90" />
              
              <div className="flex flex-col items-center sm:items-start gap-8 flex-grow relative z-10">
                <div className="flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-luxury-blue-ultra to-white text-luxury-blue-mid flex items-center justify-center border border-luxury-divider shadow-premium-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700">
                  <MapPin className="w-8 h-8 text-luxury-gold" strokeWidth={1.5} />
                  <div className="absolute inset-0 bg-luxury-gold/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                
                <div className="text-center sm:text-left w-full flex-grow flex flex-col">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-ink mb-3 tracking-tight group-hover:text-luxury-blue-mid transition-colors duration-500">
                    Service Regions
                  </h2>
                  <p className="text-sm md:text-base text-luxury-gray font-light mb-10 leading-relaxed">
                    Delivering master-level craftsmanship across the greater region.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-luxury-blue-mid mt-auto">
                    {[
                      { name: "Calgary" },
                      { name: "Airdrie" },
                      { name: "Chestermere" },
                      { name: "Greater Region" }
                    ].map((region) => (
                      <div key={region.name} className="flex items-center gap-4 group/item">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-luxury-blue-ultra border border-luxury-divider text-luxury-gold group-hover/item:bg-luxury-gold group-hover/item:text-white group-hover/item:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                          <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </div>
                        <span className="truncate group-hover/item:translate-x-1 transition-transform duration-300">{region.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FINAL CTA PANEL */}
      <FinalCTA />
    </div>
  );
};

export default Contact;
