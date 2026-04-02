import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Paintbrush, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Login | Elite Paint';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-luxury-ink shadow-2xl">
            <Paintbrush className="h-10 w-10 text-luxury-gold" />
          </div>
          <h1 className="font-serif text-4xl font-light tracking-tight text-luxury-ink">ELITE <span className="italic text-luxury-gold">ADMIN</span></h1>
          <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">Management Portal</p>
        </div>

        <div className="rounded-[3rem] bg-white p-10 shadow-2xl border border-luxury-border sm:p-12">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-gold" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-luxury-border bg-transparent py-4 pl-10 pr-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                  placeholder="admin@elitepaint.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-luxury-gold" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-luxury-border bg-transparent py-4 pl-10 pr-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-luxury-ink py-6 text-xs font-bold uppercase tracking-[0.3em] text-white transition-all hover:bg-luxury-gold hover:shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-10 text-center text-xs font-light tracking-widest text-luxury-gray uppercase">
          Not an admin? <a href="/" className="text-luxury-gold hover:underline">Go back to site</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
