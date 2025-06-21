-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to access their own data
CREATE POLICY "Admin users can view their own data" ON admin_users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own data" ON admin_users
    FOR UPDATE USING (auth.uid() = id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Function to automatically create admin_user record when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create admin_user record if the user email is in our admin list
    -- You can modify this condition based on your requirements
    IF NEW.email LIKE '%@buddyengineerz.com' OR NEW.email = 'admin@buddyengineerz.com' THEN
        INSERT INTO public.admin_users (id, email, name, role)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
            CASE 
                WHEN NEW.email = 'admin@buddyengineerz.com' THEN 'super_admin'
                ELSE 'admin'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically handle new admin users
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_admin_user();

-- Insert initial admin user (you'll need to create this user in Supabase Auth first)
-- This is just a placeholder - you'll need to replace with actual user ID after creating the auth user
/*
INSERT INTO admin_users (id, email, name, role) VALUES 
('your-admin-user-id-here', 'admin@buddyengineerz.com', 'Admin User', 'super_admin')
ON CONFLICT (email) DO NOTHING;
*/

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 