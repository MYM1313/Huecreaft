import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Using the credentials you provided as fallback values
const fallbackUrl = 'https://hdokdbtmgilveymnlquh.supabase.co';
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkb2tkYnRtZ2lsdmV5bW5scXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTU0MzksImV4cCI6MjA5MDM3MTQzOX0._XIXb3jn8eTEk8UthrbKMQZ4M0JmcwEpTCYu9a6_sRU';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey
);

export const isSupabaseConfigured = Boolean((supabaseUrl && supabaseAnonKey) || (fallbackUrl && fallbackKey));
