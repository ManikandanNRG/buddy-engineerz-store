-- Create Sample Orders for Testing
-- Run this in your Supabase SQL Editor

-- First, let's create some test users if they don't exist
DO $$
DECLARE
    user1_id UUID := gen_random_uuid();
    user2_id UUID := gen_random_uuid();
    user3_id UUID := gen_random_uuid();
BEGIN
    -- Insert test users into auth.users (if your setup allows)
    -- Note: In production, users are created through Supabase Auth
    
    -- Create user profiles for our test orders
    INSERT INTO user_profiles (id, name, phone) VALUES
    (user1_id, 'John Developer', '+91-9876543210'),
    (user2_id, 'Sarah Coder', '+91-9876543211'),
    (user3_id, 'Mike Engineer', '+91-9876543212')
    ON CONFLICT (id) DO NOTHING;
    
    -- Create sample orders
    INSERT INTO orders (
        user_id,
        order_number,
        items,
        total,
        status,
        payment_status,
        shipping_address,
        created_at
    ) VALUES
    -- Order 1: Recent pending order
    (
        user1_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-001',
        '[
            {
                "product": {
                    "id": "prod-1",
                    "name": "Algorithm Master Tee",
                    "price": 999,
                    "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop"]
                },
                "quantity": 2,
                "size": "L",
                "color": "Black"
            },
            {
                "product": {
                    "id": "prod-2",
                    "name": "Code Mug Pro",
                    "price": 699,
                    "images": ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=600&fit=crop"]
                },
                "quantity": 1,
                "size": "350ml",
                "color": "Black"
            }
        ]'::jsonb,
        2697.00,
        'pending',
        'pending',
        '{
            "name": "John Developer",
            "phone": "+91-9876543210",
            "address_line_1": "123 Tech Street",
            "address_line_2": "Apartment 4B",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560001",
            "country": "India"
        }'::jsonb,
        NOW() - INTERVAL '2 hours'
    ),
    
    -- Order 2: Confirmed order from yesterday
    (
        user2_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-002',
        '[
            {
                "product": {
                    "id": "prod-3",
                    "name": "Debug Mode Hoodie",
                    "price": 1999,
                    "images": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop"]
                },
                "quantity": 1,
                "size": "M",
                "color": "Black"
            }
        ]'::jsonb,
        1999.00,
        'confirmed',
        'completed',
        '{
            "name": "Sarah Coder",
            "phone": "+91-9876543211",
            "address_line_1": "456 Developer Lane",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001",
            "country": "India"
        }'::jsonb,
        NOW() - INTERVAL '1 day'
    ),
    
    -- Order 3: Shipped order from 3 days ago
    (
        user3_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-003',
        '[
            {
                "product": {
                    "id": "prod-4",
                    "name": "Binary Clock",
                    "price": 1299,
                    "images": ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop"]
                },
                "quantity": 1,
                "size": "One Size",
                "color": "Black"
            },
            {
                "product": {
                    "id": "prod-5",
                    "name": "Git Keychain",
                    "price": 299,
                    "images": ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=600&fit=crop"]
                },
                "quantity": 3,
                "size": "One Size",
                "color": "Silver"
            }
        ]'::jsonb,
        2196.00,
        'shipped',
        'completed',
        '{
            "name": "Mike Engineer",
            "phone": "+91-9876543212",
            "address_line_1": "789 Code Avenue",
            "city": "Hyderabad",
            "state": "Telangana",
            "pincode": "500001",
            "country": "India"
        }'::jsonb,
        NOW() - INTERVAL '3 days'
    ),
    
    -- Order 4: Delivered order from last week
    (
        user1_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-004',
        '[
            {
                "product": {
                    "id": "prod-6",
                    "name": "Programmer Sticker Pack",
                    "price": 399,
                    "images": ["https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500&h=600&fit=crop"]
                },
                "quantity": 2,
                "size": "Pack of 20",
                "color": "Mixed"
            }
        ]'::jsonb,
        798.00,
        'delivered',
        'completed',
        '{
            "name": "John Developer",
            "phone": "+91-9876543210",
            "address_line_1": "123 Tech Street",
            "address_line_2": "Apartment 4B",
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560001",
            "country": "India"
        }'::jsonb,
        NOW() - INTERVAL '7 days'
    ),
    
    -- Order 5: Cancelled order
    (
        user2_id,
        'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT || '-005',
        '[
            {
                "product": {
                    "id": "prod-7",
                    "name": "Engineer Notebook",
                    "price": 599,
                    "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=600&fit=crop"]
                },
                "quantity": 1,
                "size": "A5",
                "color": "Black"
            }
        ]'::jsonb,
        599.00,
        'cancelled',
        'refunded',
        '{
            "name": "Sarah Coder",
            "phone": "+91-9876543211",
            "address_line_1": "456 Developer Lane",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001",
            "country": "India"
        }'::jsonb,
        NOW() - INTERVAL '5 days'
    );
    
    RAISE NOTICE 'Sample orders created successfully!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating sample orders: %', SQLERRM;
END $$;

-- Verify the orders were created
SELECT 
    order_number,
    total,
    status,
    payment_status,
    created_at,
    (shipping_address->>'name') as customer_name
FROM orders 
ORDER BY created_at DESC; 