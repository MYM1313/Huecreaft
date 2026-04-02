import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Plus, Pencil, Trash2, X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 5,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*');
    if (data) setTestimonials(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);
        if (error) throw error;
        toast.success('Testimonial updated');
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([formData]);
        if (error) throw error;
        toast.success('Testimonial added');
      }

      setIsModalOpen(false);
      setEditingTestimonial(null);
      setFormData({ name: '', message: '', rating: 5 });
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-5xl font-light tracking-tight text-luxury-ink">Client <span className="italic text-luxury-gold">Testimonials</span></h1>
          <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">What your clients are saying.</p>
        </div>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            setFormData({ name: '', message: '', rating: 5 });
            setIsModalOpen(true);
          }}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-luxury-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-luxury-gold hover:shadow-2xl"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.id} className="group rounded-[3rem] border border-luxury-border bg-white p-10 shadow-lg transition-all hover:shadow-2xl hover:border-luxury-gold">
            <div className="mb-6 flex gap-1 text-luxury-gold">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mb-8 font-serif text-lg italic leading-relaxed text-luxury-gray">"{t.message}"</p>
            <h4 className="font-serif text-xl font-medium text-luxury-ink">— {t.name}</h4>
            <div className="mt-10 flex gap-3">
              <button
                onClick={() => {
                  setEditingTestimonial(t);
                  setFormData({ name: t.name, message: t.message, rating: t.rating });
                  setIsModalOpen(true);
                }}
                className="flex-1 rounded-full bg-white border border-luxury-border py-3 text-[10px] font-bold uppercase tracking-widest text-luxury-ink transition-all hover:bg-luxury-ink hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="rounded-full bg-red-50 p-3 text-red-500 transition-all hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-[4rem] border border-luxury-border bg-white p-12 shadow-2xl"
          >
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-serif text-3xl font-light text-luxury-ink">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-white p-2 text-luxury-gray hover:text-luxury-ink"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Client Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                  placeholder="Johnathan Smith"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Rating (1-5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold appearance-none"
                >
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none"
                  placeholder="Share the client's experience..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-luxury-ink py-5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {editingTestimonial ? 'Update Testimonial' : 'Save Testimonial'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
