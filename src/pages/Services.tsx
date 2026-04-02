import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProcessRoadmap from '../components/ProcessRoadmap';
import { FinalCTA } from '../components/FinalCTA';
import { cn } from '../lib/utils';
import { 
  Paintbrush, 
  Home as HomeIcon, 
  Layout, 
  Droplets, 
  CheckCircle2, 
  ArrowRight,
  Search,
  ClipboardList,
  Hammer,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const huecraftServices = [
  {
    id: 'interior-painting',
    title: 'Interior Painting',
    subtitle: 'Elevated living spaces',
    description: 'Premium interior solutions designed for durability and aesthetic excellence.',
    images: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1562663474-6cbb3fee1c77?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1615873968403-89e068628265?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Precision application', 'Long-lasting durability', 'Low-VOC materials', 'Clean execution']
  },
  {
    id: 'exterior-painting',
    title: 'Exterior Painting',
    subtitle: 'Weather-resistant elegance',
    description: 'Protect and beautify your home’s exterior with our professional coatings.',
    images: [
      'https://images.unsplash.com/photo-1518605336347-fb8396099d22?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Weather resistance', 'Surface protection', 'Climate-resistant solutions', 'Curb appeal enhancement']
  },
  {
    id: 'siding-installation',
    title: 'Siding Installation',
    subtitle: 'Structural integrity & design',
    description: 'Premium siding solutions that combine durability with modern architectural design.',
    images: [
      'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513584684374-8bdb7489feef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Structural integrity', 'Modern aesthetics', 'Expert installation', 'Energy efficiency']
  },
  {
    id: 'gutter-systems',
    title: 'Gutter Systems',
    subtitle: 'Advanced water management',
    description: 'Custom water management systems designed to protect your foundation and landscaping.',
    images: [
      'https://images.unsplash.com/photo-1635339001338-30394e3d6c8e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200'
    ],
    points: ['Seamless design', 'Efficient drainage', 'Foundation protection', 'Custom color matching']
  }
];

const processSteps = [
  { title: 'Discovery & Consultation', icon: Search },
  { title: 'Strategic Planning', icon: ClipboardList },
  { title: 'Masterful Execution', icon: Hammer },
  { title: 'Quality Assurance', icon: Sparkles }
];

const ServiceCarousel = ({ images, title }: { images: string[], title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-premium-lg group touch-pan-y border border-luxury-divider inner-highlight-dark bg-white">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute h-full w-full object-cover cursor-grab active:cursor-grabbing will-change-transform"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-6 bg-luxury-gold" : "w-1.5 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

  const Services = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      document.title = 'Services | Huecraft Corp';
    }, []);

    return (
      <div className="bg-white min-h-screen selection:bg-luxury-gold/20 overflow-x-hidden">
        {/* Hero Section: Tightened and Refined */}
        <section className="relative pt-16 pb-8 overflow-hidden bg-white border-b border-luxury-divider gpu-accelerate">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center mt-[40px]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="mb-3"
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-blue-mid bg-white px-5 py-2 rounded-full border border-luxury-divider shadow-premium-sm inner-highlight">
                  Our Expertise
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mb-4 font-serif text-4xl md:text-7xl font-bold tracking-tighter text-luxury-blue-mid leading-[0.9]"
              >
                Curated Expertise. <br />
                <span className="text-luxury-gold italic font-light">Precision-Driven.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="mx-auto max-w-lg text-sm md:text-base font-light leading-relaxed text-luxury-gray"
              >
                Premium interior and exterior solutions designed to elevate durability and aesthetics.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Showcase: Improved Identification and Spacing */}
        <section className="pb-24 bg-white gpu-accelerate">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {huecraftServices.map((service, index) => (
                <div key={service.id} className="flex flex-col gap-6 group/service-card">
                  {/* Service Label Above Image */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center gap-3 will-change-[opacity,transform]"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold/60">Service 0{index + 1}</span>
                    <div className="h-[1px] w-12 bg-luxury-gold/20" />
                  </motion.div>

                  {/* Carousel Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative will-change-[opacity,transform]"
                  >
                    <ServiceCarousel images={service.images} title={service.title} />
                  </motion.div>

                  {/* Text Block */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col will-change-[opacity,transform] flex-grow"
                  >
                    <div className="space-y-1 mb-4">
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-blue-mid tracking-tight leading-tight group-hover/service-card:text-luxury-gold transition-colors duration-500">
                        {service.title}
                      </h2>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold-muted leading-none">
                        {service.subtitle}
                      </p>
                    </div>
                    
                    <p className="text-sm md:text-base font-light leading-relaxed text-luxury-gray mb-6 line-clamp-3">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-8 flex-grow">
                      {service.points.map((point, i) => (
                        <div key={i} className="flex items-center gap-3 group/point">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-luxury-divider text-luxury-blue-mid group-hover/point:bg-luxury-gold group-hover/point:text-white group-hover/point:border-luxury-gold transition-all duration-500 shadow-premium-sm">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                          </div>
                          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-luxury-blue-mid/80">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-luxury-divider/50">
                      <motion.div
                        whileHover={{ y: -1.5 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-block w-full"
                      >
                        <Link
                          to={`/services/${service.id}`}
                          className="relative group/btn flex items-center justify-center gap-4 overflow-hidden rounded-full btn-premium-navy px-10 py-5 text-[11px] font-bold uppercase tracking-[0.4em] w-full"
                        >
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                          <span className="relative z-10">Explore Details</span>
                          <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Our Process Section: Enhanced Vertical Roadmap Animation */}
      <section className="pt-24 md:pt-32 pb-8 bg-white border-t border-luxury-divider overflow-hidden -mt-[94px] gpu-accelerate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-blue-mid">Our Process</h2>
          </div>

          <ProcessRoadmap steps={processSteps} />
        </div>
      </section>

      {/* CTA Section */}
      <FinalCTA />
    </div>
  );
};

export default Services;
