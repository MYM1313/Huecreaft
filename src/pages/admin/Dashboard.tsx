import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Briefcase, Wrench, MessageSquare, Users, ArrowUpRight, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    testimonials: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Admin Dashboard | Elite Paint';
    const fetchStats = async () => {
      try {
        const [projects, leads, testimonials, services] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('services').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          projects: projects.count || 0,
          leads: leads.count || 0,
          testimonials: testimonials.count || 0,
          services: services.count || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'text-luxury-gold', bg: 'bg-white', link: '/admin/projects' },
    { title: 'New Leads', value: stats.leads, icon: Users, color: 'text-luxury-gold', bg: 'bg-white', link: '/admin/leads' },
    { title: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'text-luxury-gold', bg: 'bg-white', link: '/admin/testimonials' },
    { title: 'Services', value: stats.services, icon: Wrench, color: 'text-luxury-gold', bg: 'bg-white', link: '/admin/services' },
  ];

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-light tracking-tight text-luxury-ink">Dashboard <span className="italic text-luxury-gold">Overview</span></h1>
        <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">Welcome back to your control panel.</p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-[3rem] border border-luxury-border bg-white p-10 transition-all hover:border-luxury-gold hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl ${card.bg} p-5 ${card.color} shadow-sm border border-luxury-border`}>
                <card.icon className="h-6 w-6" />
              </div>
              <Link to={card.link} className="text-luxury-gray transition-colors hover:text-luxury-gold">
                <ArrowUpRight className="h-6 w-6" />
              </Link>
            </div>
            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">{card.title}</p>
              <h3 className="mt-3 font-serif text-5xl font-light text-luxury-ink">{loading ? '...' : card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div className="rounded-[4rem] border border-luxury-border bg-white p-12 shadow-xl">
          <h3 className="mb-8 font-serif text-2xl font-medium text-luxury-ink">Recent Activity</h3>
          <div className="space-y-6">
            <p className="text-sm font-light italic text-luxury-gray">Activity log coming soon...</p>
          </div>
        </div>
        <div className="rounded-[4rem] border border-luxury-border bg-white p-12 shadow-xl">
          <h3 className="mb-8 font-serif text-2xl font-medium text-luxury-ink">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-6">
            <Link to="/admin/projects" className="rounded-3xl bg-white p-8 text-center transition-all hover:bg-luxury-ink hover:text-white border border-luxury-border">
              <p className="text-xs font-bold uppercase tracking-widest">Add Project</p>
            </Link>
            <Link to="/admin/leads" className="rounded-3xl bg-white p-8 text-center transition-all hover:bg-luxury-ink hover:text-white border border-luxury-border">
              <p className="text-xs font-bold uppercase tracking-widest">View Leads</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
