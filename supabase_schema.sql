/*
  SUPABASE DATABASE SCHEMA

  -- 1. Projects Table
  CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- 2. Services Table
  CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
  );

  -- 3. Testimonials Table
  CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)
  );

  -- 4. Leads Table
  CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- RLS POLICIES

  -- Enable RLS
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE services ENABLE ROW LEVEL SECURITY;
  ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
  ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

  -- Public Read Access
  CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
  CREATE POLICY "Public Read Services" ON services FOR SELECT USING (true);
  CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);

  -- Admin Full Access (Authenticated Users)
  CREATE POLICY "Admin Full Projects" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin Full Services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin Full Testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
  CREATE POLICY "Admin Full Leads" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Public Lead Submission
  CREATE POLICY "Public Create Leads" ON leads FOR INSERT WITH CHECK (true);

  -- STORAGE BUCKET
  -- Create a bucket named 'project-images' in Supabase Storage
  -- Set it to public
  -- Add policies:
  -- 1. Public Read: (true)
  -- 2. Authenticated Upload: (role() = 'authenticated')
  -- 3. Authenticated Delete: (role() = 'authenticated')
*/
