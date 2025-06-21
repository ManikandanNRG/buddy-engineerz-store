-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public to read categories
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Allow admins to manage categories
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Insert default categories
INSERT INTO categories (name, description, image_url) VALUES 
('T-Shirts', 'Engineering and tech-themed t-shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'),
('Hoodies', 'Comfortable hoodies for developers', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'),
('Accessories', 'Tech accessories and gadgets', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
('Stickers', 'Programming and engineering stickers', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400'),
('Mugs', 'Coffee mugs for developers', 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400')
ON CONFLICT (name) DO NOTHING;

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RPC function for creating categories table (fallback)
CREATE OR REPLACE FUNCTION create_categories_table()
RETURNS void AS $$
BEGIN
  -- This function is called from the React app as a fallback
  -- The table creation is already handled above
  RAISE NOTICE 'Categories table setup completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 