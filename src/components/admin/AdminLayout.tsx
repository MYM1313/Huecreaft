import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wrench, 
  MessageSquare, 
  Users, 
  LogOut, 
  ExternalLink,
  Paintbrush,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Leads', path: '/admin/leads', icon: Users },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-white text-luxury-ink">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-luxury-border bg-white shadow-2xl transition-transform md:translate-x-0">
        <div className="flex h-full flex-col px-6 py-10">
          <div className="mb-12 flex items-center gap-4 px-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-luxury-ink shadow-lg">
              <Paintbrush className="h-6 w-6 text-luxury-gold" />
            </div>
            <span className="font-serif text-2xl font-light tracking-tight">ELITE<span className="italic text-luxury-gold">ADMIN</span></span>
          </div>

          <nav className="flex-1 space-y-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center justify-between rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest transition-all",
                    isActive 
                      ? "bg-luxury-ink text-white shadow-xl" 
                      : "text-luxury-gray hover:bg-white hover:text-luxury-ink"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={cn("h-5 w-5", isActive ? "text-luxury-gold" : "text-luxury-gray group-hover:text-luxury-gold")} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 text-luxury-gold" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3 border-t border-luxury-border pt-8">
            <Link
              to="/"
              className="flex items-center gap-4 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gray transition-all hover:bg-white hover:text-luxury-ink"
            >
              <ExternalLink className="h-5 w-5 text-luxury-gold" />
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-50/50"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="min-h-screen p-6 md:p-10 lg:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
