import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

type Project = Database['public']['Tables']['projects']['Row'];

const ManageProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
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
    const filePath = `projects/${fileName}`;

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

      if (!imageUrl) {
        throw new Error('Please upload an image');
      }

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update({ ...formData, image_url: imageUrl })
          .eq('id', editingProject.id);
        if (error) throw error;
        toast.success('Project updated successfully');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{ ...formData, image_url: imageUrl }]);
        if (error) throw error;
        toast.success('Project added successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      toast.success('Project deleted');
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      image_url: project.image_url,
    });
    setPreviewUrl(project.image_url);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', category: '', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <div>
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-5xl font-light tracking-tight text-luxury-ink">Manage <span className="italic text-luxury-gold">Projects</span></h1>
          <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">Add or edit your portfolio items.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-luxury-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-luxury-gold hover:shadow-2xl"
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </button>
      </div>

      {loading ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-[3rem] bg-white border border-luxury-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-[3rem] border border-luxury-border bg-white shadow-lg transition-all hover:shadow-2xl hover:border-luxury-gold">
              <div className="h-64 overflow-hidden">
                <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">{project.category}</span>
                <h3 className="mt-2 font-serif text-2xl font-medium text-luxury-ink">{project.title}</h3>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => openEditModal(project)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white border border-luxury-border py-3 text-[10px] font-bold uppercase tracking-widest text-luxury-ink transition-all hover:bg-luxury-ink hover:text-white"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center justify-center rounded-full bg-red-50 p-3 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-luxury-ink/40 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl rounded-[4rem] border border-luxury-border bg-white p-12 shadow-2xl"
          >
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-serif text-3xl font-light text-luxury-ink">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-white p-2 text-luxury-gray hover:text-luxury-ink">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Project Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold"
                    placeholder="Modern Villa Interior"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold appearance-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Interior">Interior</option>
                    <option value="Exterior">Exterior</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full border-b border-luxury-border bg-transparent py-4 text-luxury-ink outline-none transition-all focus:border-luxury-gold resize-none"
                  placeholder="Describe the project details..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Project Image</label>
                <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-luxury-border bg-white transition-all hover:border-luxury-gold">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-3 h-10 w-10 text-luxury-gold opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-widest text-luxury-gray">Click to upload image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full bg-white py-5 text-[10px] font-bold uppercase tracking-widest text-luxury-ink hover:bg-luxury-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-[2] items-center justify-center gap-3 rounded-full bg-luxury-ink py-5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-luxury-gold disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {editingProject ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
