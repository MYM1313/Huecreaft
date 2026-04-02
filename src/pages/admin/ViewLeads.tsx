import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Trash2, Mail, Phone, MapPin, Calendar, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '../../lib/utils';

type Lead = Database['public']['Tables']['leads']['Row'];

const ViewLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead entry?')) return;
    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      toast.success('Lead deleted');
      fetchLeads();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mb-12">
        <h1 className="font-serif text-5xl font-light tracking-tight text-luxury-ink">Transformation <span className="italic text-luxury-gold">Requests</span></h1>
        <p className="mt-2 text-sm font-light tracking-widest text-luxury-gray uppercase">Manage your incoming business leads.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[3rem] bg-white border border-luxury-border"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {leads.length === 0 ? (
            <div className="rounded-[4rem] border border-luxury-border bg-white p-24 text-center shadow-xl">
              <p className="font-serif text-2xl italic text-luxury-gray">No leads found yet.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="group relative overflow-hidden rounded-[3rem] border border-luxury-border bg-white p-10 transition-all hover:border-luxury-gold hover:shadow-2xl">
                <div className="grid gap-10 lg:grid-cols-4">
                  <div className="lg:col-span-1">
                    <h3 className="font-serif text-2xl font-medium text-luxury-ink">{lead.name}</h3>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-sm font-light text-luxury-gray">
                        <Mail className="h-4 w-4 text-luxury-gold" />
                        {lead.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-light text-luxury-gray">
                        <Phone className="h-4 w-4 text-luxury-gold" />
                        {lead.phone}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Service & Location</p>
                    <div className="mt-6 space-y-4">
                      <div className="inline-block rounded-full bg-white border border-luxury-border px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
                        {lead.service}
                      </div>
                      <div className="flex items-start gap-3 text-sm font-light text-luxury-gray leading-relaxed">
                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-luxury-gold" />
                        {lead.address}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gray">Message</p>
                    <div className="mt-6 flex items-start gap-3 text-sm font-light text-luxury-gray leading-relaxed">
                      <MessageSquare className="mt-1 h-4 w-4 shrink-0 text-luxury-gold" />
                      <p className="line-clamp-4 italic">"{lead.message}"</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-6 lg:col-span-1">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-widest text-luxury-gray">
                        <Calendar className="h-3 w-3" />
                        {formatDate(lead.created_at)}
                      </div>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="mt-6 flex items-center gap-2 rounded-full bg-red-50 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewLeads;
