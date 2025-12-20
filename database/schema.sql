-- 1. Hapus tipe enum jika sudah ada (untuk reset)
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- 2. Buat Tipe Data Enum
CREATE TYPE user_role AS ENUM ('BUYER', 'VENDOR', 'AGENT');
CREATE TYPE order_status AS ENUM ('PENDING', 'ASSIGNED', 'PICKED_UP', 'COMPLETED', 'CANCELLED');

-- 3. Tabel Users (Menampung Pembeli, Pedagang, dan Agen)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Nanti di aplikasi ini harus di-hash (bcrypt)
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'BUYER',
    address TEXT,
    wallet_balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Products (Barang Dagangan)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES users(id) ON DELETE CASCADE, -- Jika user dihapus, barang ikut terhapus
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Orders (Transaksi)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    buyer_id INT REFERENCES users(id) ON DELETE SET NULL,
    vendor_id INT REFERENCES users(id) ON DELETE SET NULL,
    agent_id INT REFERENCES users(id) ON DELETE SET NULL, 
    status order_status DEFAULT 'PENDING',
    total_price DECIMAL(12, 2) NOT NULL,
    delivery_fee DECIMAL(12, 2) NOT NULL,
    pickup_token VARCHAR(10),   -- Kode Validasi Agen ambil ke Pedagang
    delivery_token VARCHAR(10), -- Kode Validasi Agen serahkan ke Pembeli
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Order Items (Detail Barang dalam Order)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price_at_buy DECIMAL(12, 2) NOT NULL -- Harga snapshot
);

CREATE TYPE transaction_type AS ENUM ('TOPUP', 'PAYMENT', 'EARNING', 'WITHDRAWAL');

-- Buat Tabel Transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE, -- Siapa yang bertransaksi
    order_id INT REFERENCES orders(id) ON DELETE SET NULL, -- Opsional: Terisi jika transaksi terkait order
    amount DECIMAL(12, 2) NOT NULL, -- Nominal uang
    type transaction_type NOT NULL, -- Jenis transaksi
    description TEXT, -- Catatan, misal: "Bayar ke Bu Suti" atau "Topup via Bank"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);