-- A. Insert Users (Password: '123456' - hanya contoh)
INSERT INTO users (name, email, password, phone, role, address, wallet_balance) VALUES
('Budi Pembeli', 'budi@gmail.com', '123456', '08123456789', 'BUYER', 'Jl. Mawar No. 10', 500000),
('Bu Suti Sayur', 'suti@pasar.com', '123456', '08198765432', 'VENDOR', 'Lapak B-12 Pasar Induk', 100000),
('Mas Jago Gerobak', 'jago@agen.com', '123456', '08122233344', 'AGENT', 'Area Kelurahan Sukamaju', 50000);

-- B. Insert Products (Milik Bu Suti - ID 2)
INSERT INTO products (vendor_id, name, description, price, stock, image_url) VALUES
(2, 'Bayam Ikat Segar', 'Bayam petik pagi langsung dari petani', 3000, 50, 'https://placehold.co/200x200?text=Bayam'),
(2, 'Wortel Brastagi 500gr', 'Wortel oranye segar dan manis', 8000, 20, 'https://placehold.co/200x200?text=Wortel'),
(2, 'Tempe Daun', 'Tempe kedelai murni bungkus daun pisang', 2500, 30, 'https://placehold.co/200x200?text=Tempe');

-- C. Insert 1 Contoh Order (Budi beli ke Bu Suti)
INSERT INTO orders (buyer_id, vendor_id, status, total_price, delivery_fee, pickup_token, delivery_token) VALUES
(1, 2, 'PENDING', 13500, 5000, 'AB12', 'XY99');

-- D. Insert Detail Order tadi (1 Bayam, 1 Wortel, 1 Tempe)
-- Order ID diasumsikan 1 karena baru pertama dibuat
INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES
(1, 1, 1, 3000), -- 1 Bayam
(1, 2, 1, 8000), -- 1 Wortel
(1, 3, 1, 2500); -- 1 Tempe

-- E. Insert Contoh Transaksi terkait Order dan Topup
INSERT INTO transactions (user_id, order_id, amount, type, description) VALUES
(1, NULL, 500000, 'TOPUP', 'Topup awal via Transfer Bank'),
(1, 1, 18500, 'PAYMENT', 'Pembayaran untuk Order #1'),
(2, 1, 13500, 'EARNING', 'Penjualan barang Order #1'),
(3, 1, 5000, 'EARNING', 'Komisi pengantaran Order #1');