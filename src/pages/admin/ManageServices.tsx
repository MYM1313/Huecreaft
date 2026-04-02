import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

type Service = Database['public']['Tables']['services']['Row'];

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*');
    if (data) setServices(data);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `services/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      if (!imageUrl) throw new Error('Image is required');

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update({ ...formData, image_url: imageUrl })
          .eq('id', editingService.id);
        if (error) throw error;
        toast.success('Service updated');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{ ...formData, image_url: imageUrl }]);
        if (error) throw error;
        toast.success('Service added');
      }

      setIsModalOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      toast.success('Service deleted');
      fetchServices();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({ title: '', description: '', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div>
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-5xl font-light tracking-tight text-luxury-ink">Manage <span className="italic text-luxury-gold">Services</span></h1>
          <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">Define what you offer to clients.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-luxury-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-luxury-gold hover:shadow-2xl"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="group rounded-[3rem] border border-luxury-border bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:border-luxury-gold">
            <div className="mb-6 h-48 overflow-hidden rounded-[2rem]">
              <img src={service.image_url} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <h3 className="font-serif text-2xl font-medium text-luxury-ink">{service.title}</h3>
            <p className="mt-4 text-sm font-light text-luxury-gray line-clamp-2 leading-relaxed">{service.description}</p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setEditingService(service);
                  setFormData({ title: service.title, description: service.description, image_url: service.image_url });
                  setPreviewUrl(service.image_url);
                  setIsModalOpen(true);
                }}
                className="flex-1 rounded-full bg-white border border-luxury-border py-3 text-[10px] font-bold uppercase tracking-widest text-luxury-ink transition-all hover:bg-luxury-ink hover:text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
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
              <h2 className="font-serif text-3xl font-light text-luxury-ink">{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-white p-2 text-luxury-gray hover:text-luxury-ink"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Service Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                  placeholder="Premium Interior Finish"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none"
                  placeholder="Describe the service details..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Service Image</label>
                <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-luxury-border bg-white transition-all hover:border-luxury-gold">
                  {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : <ImageIcon className="h-10 w-10 text-luxury-gold opacity-50" />}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-luxury-ink py-5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {editingService ? 'Update Service' : 'Save Service'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
