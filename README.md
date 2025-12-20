/pasargerak
├── .env.local                 # Database Credentials (DB_USER, DB_PASS, dll)
├── package.json
├── middleware.js              # Cek Login & Role (Security Gate)
├── next.config.js
├── tailwind.config.js
│
├── 📂 app/                    # ROUTING LAYER (Next.js App Router)
│   ├── layout.js              # Root Layout (Font, Metadata Global)
│   ├── page.js                # Landing Page (Intro Aplikasi)
│   │
│   ├── 📂 (auth)/             # GROUP: Autentikasi (Tanpa sidebar/header khusus)
│   │   ├── login/page.js
│   │   └── register/page.js
│   │
│   ├── 📂 (buyer)/            # GROUP: Modul Pembeli (Layout mirip Marketplace)
│   │   ├── layout.js          # Navbar Pembeli + Cart Icon
│   │   ├── home/page.js       # List Produk
│   │   ├── product/[id]/      # Detail Produk
│   │   ├── cart/page.js       # Keranjang
│   │   └── profile/page.js    # Riwayat Order Pembeli
│   │
│   ├── 📂 vendor/             # MODUL: Pedagang (URL: /vendor/...)
│   │   ├── layout.js          # Sidebar Admin Panel (Dashboard style)
│   │   ├── dashboard/         # Ringkasan Order Masuk
│   │   ├── products/          # CRUD Produk (List, Add, Edit)
│   │   └── orders/            # Validasi Order & Generate Token Pickup
│   │
│   ├── 📂 agent/              # MODUL: Agen Gerobak (URL: /agent/...)
│   │   ├── layout.js          # Mobile First Layout (Bottom Navigation)
│   │   ├── missions/          # List Job (Order di area pasar)
│   │   ├── pickup/            # Scanner/Input Token Pickup
│   │   ├── delivery/          # Peta/List Pengantaran & Input Token Penerima
│   │   └── wallet/            # Cek Komisi
│   │
│   └── 📂 api/                # API ROUTES (Backend Endpoints)
│       ├── auth/              # Login/Register API
│       ├── products/          # GET, POST Products
│       └── orders/            # Transaction Logic
│
├── 📂 components/             # UI COMPONENTS
│   ├── 📂 ui/                 # Reusable (Button, Input, Card, Modal)
│   ├── 📂 buyer/              # Khusus Pembeli (ProductCard, CategoryFilter)
│   ├── 📂 vendor/             # Khusus Vendor (OrderTable, StockWidget)
│   └── 📂 agent/              # Khusus Agent (MissionCard, CameraScanner)
│
├── 📂 lib/                    # CONFIG & UTILS
│   ├── db.js                  # Koneksi Postgres (pg pool) - Yg kita buat sebelumnya
│   ├── auth.js                # Helper cek session user
│   └── utils.js               # Formatter Rupiah, Date formatter
│
├── 📂 services/               # ⚡ DATA LAYER (TEMPAT SQL MANUAL ANDA) ⚡
│   ├── product.service.js     # Function: getProducts(), createProduct()...
│   ├── order.service.js       # Function: createOrder(), validatePickup()...
│   └── user.service.js        # Function: findUserByEmail(), createUser()...
│
└── 📂 database/               # DOKUMENTASI DB
    ├── schema.sql             # Script SQL Create Table (Arsip)
    └── seed.sql               # Data dummy awal