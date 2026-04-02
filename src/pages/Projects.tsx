import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, ArrowRight, MapPin, ShieldCheck, Award, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FinalCTA } from '../components/FinalCTA';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

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

interface Project {
  id: string;
  label: string;
  title: string;
  microStory: string;
  category: string;
  description: string;
  tags: string[];
  bullets: string[];
  before: string;
  after: string;
}

// Mock data for projects to ensure premium visual-first experience
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    label: 'Project 01',
    title: 'Modern Interior Transformation',
    microStory: 'Client wanted a modern and durable finish for their open-concept living area.',
    category: 'Interior',
    description: 'We transformed this space with precision surface preparation and premium coatings to achieve a long-lasting, refined finish.',
    tags: ['Long-lasting finish', 'Premium coating', 'Eco-friendly'],
    bullets: [
      'Surface preparation',
      'Premium coating applied',
      'Smooth finish',
      'Long-lasting durability'
    ],
    before: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=1200&fm=webp',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200&fm=webp'
  },
  {
    id: '2',
    label: 'Project 02',
    title: 'Coastal Exterior Revitalization',
    microStory: 'Outdated exterior transformed into a premium, weather-resistant coastal masterpiece.',
    category: 'Exterior',
    description: 'A complete exterior overhaul using weather-resistant premium paints designed to withstand harsh coastal elements while maintaining aesthetic brilliance.',
    tags: ['Weather resistant', 'UV protection', 'Coastal grade'],
    bullets: [
      'Weather-shield technology',
      'UV resistant pigments',
      'Detailed trim work',
      'Eco-friendly materials'
    ],
    before: 'https://images.unsplash.com/photo-1505843513577-22bb7d21ef45?auto=format&fit=crop&q=80&w=1200&fm=webp',
    after: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200&fm=webp'
  },
  {
    id: '3',
    label: 'Project 03',
    title: 'Heritage Siding Restoration',
    microStory: 'Preserving history with modern protection for this classic heritage home.',
    category: 'Siding',
    description: 'Restoring the classic charm of a heritage home with specialized siding treatments and custom color matching.',
    tags: ['Heritage preservation', 'Custom matching', 'Protective seal'],
    bullets: [
      'Custom color matching',
      'Heritage preservation',
      'Structural siding repair',
      'Premium protective seal'
    ],
    before: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200&fm=webp',
    after: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=1200&fm=webp'
  },
  {
    id: '4',
    label: 'Project 04',
    title: 'Seamless Gutter Integration',
    microStory: 'Functional upgrade that perfectly complements the home\'s architectural lines.',
    category: 'Gutter',
    description: 'High-performance seamless gutter installation that blends perfectly with the architectural lines of the property.',
    tags: ['Seamless design', 'High-flow capacity', 'Leaf guard'],
    bullets: [
      'Seamless aluminum design',
      'Architectural blending',
      'High-flow capacity',
      'Leaf guard protection'
    ],
    before: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1200&fm=webp',
    after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200&fm=webp'
  },
  {
    id: '5',
    label: 'Project 05',
    title: 'Luxury Estate Interior',
    microStory: 'Bespoke finishes for a high-end estate, emphasizing elegance and detail.',
    category: 'Interior',
    description: 'Bespoke interior finishes for a luxury estate, featuring metallic accents and hand-polished surfaces.',
    tags: ['Metallic accents', 'Hand-polished', 'Luxury finish'],
    bullets: [
      'Metallic accent walls',
      'Hand-polished finishes',
      'Zero-VOC premium paint',
      'Precision masking'
    ],
    before: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200&fm=webp',
    after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200&fm=webp'
  }
];

const CATEGORIES = ['All', 'Interior', 'Exterior', 'Siding', 'Gutter'];

const LuxuryFilter = ({ current, onSelect }: { current: string; onSelect: (cat: string) => void }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`relative px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 tap-interaction ${
            current === cat 
              ? 'text-white' 
              : 'text-luxury-gray hover:text-luxury-blue-mid bg-white border border-luxury-divider shadow-premium-sm hover:shadow-premium-md'
          }`}
        >
          {current === cat && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-luxury-gold rounded-full shadow-premium-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{cat}</span>
        </button>
      ))}
    </div>
  );
};

interface Project {
  id: string;
  label: string;
  title: string;
  category: string;
  description: string;
  bullets: string[];
  before: string;
  after: string;
}

const ProjectBlock: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isHero = index === 0;

  return (
    <div ref={ref} className={`mb-12 lg:mb-0 mx-auto transition-all duration-700 w-full flex flex-col group/project-card`}>
      <div className="flex flex-col items-start text-left flex-grow">
        {/* 1. Project Label (Project One) - Left Aligned */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 ml-1 md:ml-2"
        >
          <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
            {project.label}
          </span>
        </motion.div>

        {/* 2. Image (Slider) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4, transition: { duration: 0.4, ease: "easeOut" } }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full mb-6 relative shadow-premium-md rounded-[1.5rem] overflow-hidden will-change-[opacity,transform]"
        >
          <BeforeAfterSlider 
            beforeImage={project.before} 
            afterImage={project.after} 
            priority={isHero} 
            className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-[1.5rem]"
          />
        </motion.div>

        {/* 3. Title & Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3 mb-6 w-full ml-1 md:ml-2 will-change-[opacity,transform]"
        >
          <div className="space-y-2">
            <h2 className="font-serif font-bold text-luxury-blue-mid tracking-tight text-2xl md:text-3xl lg:text-4xl group-hover/project-card:text-luxury-gold transition-colors duration-500">
              {project.title}
            </h2>
            <p className="text-xs md:text-sm font-medium italic text-luxury-gold/80 tracking-wide line-clamp-2">
              "{project.microStory}"
            </p>
          </div>
          
          {/* Proof Tags */}
          <div className="flex flex-wrap justify-start gap-2 pt-2">
            {project.tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[9px] font-bold uppercase tracking-wider text-luxury-blue-mid border border-luxury-divider shadow-premium-sm inner-highlight">
                <span className="text-luxury-gold">✔</span> {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 4. Description & Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full ml-1 md:ml-2 will-change-[opacity,transform] flex flex-col flex-grow"
        >
          <p className="text-sm md:text-base font-light leading-relaxed text-luxury-gray mb-6 line-clamp-3">
            {project.description}
          </p>

          {/* Key Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 w-full mt-auto pt-4 border-t border-luxury-divider/50 text-left">
            {project.bullets.map((bullet: string, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 2 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + (i * 0.05) }}
                className="flex items-center gap-2 text-[10px] md:text-[11px] font-medium uppercase tracking-wider text-luxury-ink"
              >
                <div className="h-1 w-1 rounded-full bg-luxury-gold shadow-sm shrink-0" />
                <span className="leading-tight">{bullet}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    document.title = 'Our Work | Huecraft';
  }, []);

  const filteredProjects = useMemo(() => {
    return filter === 'All'
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter(p => p.category === filter);
  }, [filter]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleFilterChange = (cat: string) => {
    if (cat === filter) return;
    setIsFiltering(true);
    setFilter(cat);
    setVisibleCount(3);
    // Smooth transition for filtering
    setTimeout(() => setIsFiltering(false), 400);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 2);
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-0 overflow-x-hidden gpu-accelerate">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="mb-12 text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-luxury-divider shadow-premium-sm inner-highlight mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-blue-mid">Our recent work</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="font-serif text-4xl md:text-6xl font-bold tracking-tighter text-luxury-blue-mid leading-[0.9]"
          >
            Masterpieces in <br />
            <span className="text-luxury-gold italic font-light">Every Stroke.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="text-base md:text-lg font-light text-luxury-gray tracking-tight max-w-xl mx-auto leading-relaxed"
          >
            Explore our gallery of transformations, where precision meets artistry in every project.
          </motion.p>
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex justify-center sticky top-20 z-40 py-3 pointer-events-none">
          <div className="pointer-events-auto">
            <LuxuryFilter current={filter} onSelect={handleFilterChange} />
          </div>
        </div>

        {/* Project Showcase */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {!isFiltering ? (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
              >
                {visibleProjects.map((project, index) => (
                  <ProjectBlock key={project.id} project={project} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-96 w-full flex items-center justify-center"
              >
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {visibleCount < filteredProjects.length && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLoadMore}
            className="group relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-luxury-blue-mid to-luxury-ink px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-premium-md transition-all hover:shadow-premium-lg active:scale-95 inner-highlight overflow-hidden"
          >
            {/* Continuous Spark/Shimmer Effect */}
            <motion.div 
              className="absolute top-0 bottom-0 w-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-0"
              animate={{ left: ["-150%", "150%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 0.5 }}
            />
            
            <span className="relative z-10">Explore More Transformations</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
          </motion.button>
        </motion.div>
        )}

        {filteredProjects.length === 0 && (
          <div className="py-32 text-center">
            <p className="font-serif text-2xl font-light text-luxury-gray">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>

      {/* WHY CHOOSE US SECTION - CLEAN PREMIUM SCROLL */}
      <section className="py-24 md:py-32 px-4 bg-white overflow-hidden gpu-accelerate">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 px-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-blue-mid mb-4 block">
              The Advantage
            </span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-luxury-ink tracking-tighter">
              Why Huecraft.
            </h2>
          </div>

          {/* Horizontal Scroll Container (Mobile) / Grid (Desktop) */}
          <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
            <div 
              className="flex lg:grid lg:grid-cols-4 gap-5 lg:gap-8 overflow-x-auto lg:overflow-visible pb-12 lg:pb-0 no-scrollbar snap-x snap-mandatory lg:snap-none cursor-grab active:cursor-grabbing lg:cursor-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {[
                { 
                  icon: ShieldCheck, 
                  title: "Climate Ready", 
                  desc: "Scientifically engineered to withstand extreme temperature fluctuations and high humidity."
                },
                { 
                  icon: Award, 
                  title: "Premium Materials", 
                  desc: "Exclusively sourced architectural-grade pigments and resins for superior depth."
                },
                { 
                  icon: Users, 
                  title: "Master Artisans", 
                  desc: "Career professionals with decades of experience in high-end restoration."
                },
                { 
                  icon: Clock, 
                  title: "Precision Timelines", 
                  desc: "Advanced project management systems ensuring milestones are met with surgical precision."
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex-none w-[75vw] sm:w-[60vw] md:w-[280px] lg:w-auto snap-start lg:snap-align-none"
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-square p-8 md:p-10 rounded-[2rem] bg-white border border-luxury-divider shadow-premium-md flex flex-col items-start justify-center text-left group transition-all duration-500 overflow-hidden h-full will-change-[transform,box-shadow]"
                  >
                    {/* Subtle Golden Gradient Background Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Premium Icon Container */}
                    <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-luxury-blue-ultra shadow-premium-sm flex items-center justify-center mb-6 group-hover:shadow-premium-md group-hover:bg-white transition-all duration-500 border border-luxury-divider/20">
                      <item.icon className="w-7 h-7 md:w-8 md:h-8 text-luxury-gold drop-shadow-sm" />
                      
                      {/* Subtle Glow */}
                      <div className="absolute inset-0 bg-luxury-gold/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <h3 className="relative z-10 font-serif text-xl md:text-2xl font-bold text-luxury-ink mb-3 tracking-tight group-hover:text-luxury-blue-mid transition-colors duration-500">
                      {item.title}
                    </h3>
                    
                    <p className="relative z-10 text-xs md:text-sm font-medium text-luxury-gray leading-relaxed line-clamp-3 group-hover:text-luxury-gray-deep transition-colors duration-500">
                      {item.desc}
                    </p>

                    {/* Golden Accent Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold/30 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    
                    {/* Top Corner Reflection */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-luxury-gold/5 rounded-full blur-2xl group-hover:bg-luxury-gold/10 transition-all duration-700" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA />
    </div>
  );
};

export default Projects;

