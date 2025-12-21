import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-pg-primary py-20 px-4 overflow-hidden">
        {/* Dekorasi Latar Belakang */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-2xl"></div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Mendigitalisasi <span className="text-yellow-300">Pasar Tradisional</span>
          </h1>
          <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
            PasarGerak hadir untuk menghubungkan kehangatan pasar tradisional dengan kemudahan teknologi modern. Belanja segar, dukung pedagang lokal, dan berdayakan tetangga sekitar.
          </p>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        
        {/* Misi Kami */}
        <div className="text-center">
            <h2 className="text-3xl font-bold text-pg-text mb-4">Misi Kami</h2>
            <div className="w-20 h-1 bg-pg-secondary mx-auto mb-8 rounded-full"></div>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                Kami percaya bahwa pasar tradisional adalah jantung ekonomi rakyat. Namun, zaman berubah. 
                PasarGerak membangun jembatan digital agar pedagang pasar tidak tertinggal, pembeli mendapatkan 
                bahan masakan termurah & tersegar, dan warga sekitar mendapatkan penghasilan tambahan sebagai Agen.
            </p>
        </div>

        {/* 3 PILAR EKOSISTEM (Cards) */}
        <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Pedagang */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center border border-orange-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🏪
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Pedagang Pasar</h3>
                <p className="text-gray-600 text-sm">
                    Memberdayakan pedagang lokal untuk menjangkau lebih banyak pembeli tanpa harus sewa ruko mahal. Cukup dari lapak pasar mereka.
                </p>
            </div>

            {/* Card 2: Pembeli */}
            <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🛒
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Pembeli Cerdas</h3>
                <p className="text-gray-600 text-sm">
                    Ibu rumah tangga & anak kos bisa belanja sayur segar harian dengan harga pasar asli, tanpa perlu becek-becekan & bangun pagi buta.
                </p>
            </div>

            {/* Card 3: Agen */}
            <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    🛵
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Agen Gerobak</h3>
                <p className="text-gray-600 text-sm">
                    Menciptakan lapangan kerja baru bagi warga sekitar untuk menjadi kurir logistik yang efisien dan mendapatkan penghasilan harian.
                </p>
            </div>
        </div>

        {/* --- STATISTIK (Mockup) --- */}
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-10">Dampak yang Kami Ciptakan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <div className="text-4xl font-bold text-pg-secondary mb-2">100+</div>
                    <div className="text-sm text-gray-400">Pedagang Pasar</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                    <div className="text-sm text-gray-400">Keluarga Terbantu</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
                    <div className="text-sm text-gray-400">Agen Aktif</div>
                </div>
                <div>
                    <div className="text-4xl font-bold text-green-400 mb-2">24h</div>
                    <div className="text-sm text-gray-400">Kesegaran Terjamin</div>
                </div>
            </div>
        </div>

        {/* --- CTA --- */}
        <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Siap Menjadi Bagian dari Revolusi Pasar?</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/" className="bg-pg-primary text-white font-bold px-8 py-3 rounded-full hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                    Mulai Belanja Sekarang
                </Link>
                <Link href="/register" className="bg-white text-pg-primary border-2 border-pg-primary font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors">
                    Gabung Mitra
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}