-- ALTER QUERIES FOR EXISTING ADDRESSES TABLE
-- Run these queries in your Supabase SQL Editor to update the existing table

-- 1. Add the type column with default value and constraint
ALTER TABLE addresses 
ADD COLUMN type VARCHAR(20) DEFAULT 'home' 
CHECK (type IN ('home', 'work', 'other'));

-- 2. Add the updated_at column
ALTER TABLE addresses 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Update existing records to have updated_at = created_at
UPDATE addresses 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- 4. Create trigger for auto-updating updated_at (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create trigger for addresses table
CREATE TRIGGER update_addresses_updated_at 
BEFORE UPDATE ON addresses 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'addresses' 
ORDER BY ordinal_position; 