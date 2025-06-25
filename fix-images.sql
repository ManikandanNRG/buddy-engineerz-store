-- Check current product images
SELECT id, name, image_url 
FROM products 
LIMIT 10;

-- Update products with proper image URLs
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' WHERE name = 'Code Ninja T-Shirt';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop' WHERE name = 'Debug Mode Hoodie';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop' WHERE name = 'Stack Overflow Survivor';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop' WHERE name = 'Git Commit Champion';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' WHERE name = 'Database Test';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop' WHERE name = 'MAni';

-- Update any remaining products with NULL or broken image URLs
UPDATE products 
SET image_url = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
WHERE image_url IS NULL OR image_url = '' OR image_url NOT LIKE 'http%';

-- Check results
SELECT id, name, image_url 
FROM products 
ORDER BY name;