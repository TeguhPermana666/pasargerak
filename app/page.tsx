import Link from "next/link";
import { getAllProducts } from '@/services/product.service';
import ProductList from '@/components/vendor/ProductList';
import SuccessToast from "@/components/ui/SuccessToast";
import FloatingCart from "@/components/buyer/FloatingCart";
export const dynamic = 'force-dynamic';

// 1. Ubah definisi Type Props: searchParams adalah Promise
export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ success?: string }> 
}) {
  
  // 2. Fetch Data Produk
  let products = [];
  try {
    products = await getAllProducts();
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
  }

  // 3. PENTING: Await searchParams sebelum membaca propertinya
  const params = await searchParams;
  const showSuccessMessage = params?.success === 'true';

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* --- FLOATING CART --- */}
      <FloatingCart/>
      {/* --- NOTIFIKASI SUKSES --- */}
      {showSuccessMessage && <SuccessToast />}

      {/* --- HERO SECTION --- */}
      <section className="w-full bg-gradient-to-b from-green-50 to-white py-20 px-4 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-pg-primary text-xs font-bold tracking-wide mb-4">
          🛒 REVOLUSI PASAR TRADISIONAL
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-pg-text mb-6">
          Belanja Pasar, <span className="text-pg-primary">Diantar Tetangga.</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Hubungkan pedagang pasar tradisional dengan pembeli rumahan melalui jaringan agen gerobak lokal. Segar, Cepat, dan Memberdayakan.
        </p>
        
        <div className="flex gap-4 justify-center">
           <Link href="#shop" className="px-8 py-3 bg-pg-primary text-white rounded-xl font-semibold shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1">
             Mulai Belanja
           </Link>
           <Link href="/about" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
             Pelajari Cara Kerja
           </Link>
        </div>
      </section>

      {/* --- MARKETPLACE SECTION --- */}
      <section id="shop" className="w-full max-w-7xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-pg-text flex items-center gap-2">
                <span>🥬</span> Etalase Pasar Hari Ini
              </h2>
              <p className="text-gray-500 text-sm mt-1">Stok diperbarui langsung oleh pedagang pasar.</p>
            </div>
            <span className="bg-green-50 text-pg-primary text-xs font-bold px-3 py-1 rounded-full border border-green-100">
              {products.length} Produk Tersedia
            </span>
          </div>

          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
              <div className="text-4xl mb-4">😔</div>
              <h3 className="text-lg font-bold text-gray-700">Belum ada produk di etalase</h3>
              <p className="text-gray-500 text-sm">Pedagang mungkin sedang istirahat atau stok belum diupdate.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- ROLES SECTION --- */}
      <section className="w-full max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-8">
        {/* Card: Pembeli */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-4">👤</div>
          <h3 className="text-xl font-bold text-pg-text mb-2">Pembeli Rumahan</h3>
          <p className="text-gray-500 text-sm mb-4">Pesan sayur dan lauk pauk segar dari pasar terdekat tanpa perlu keluar rumah.</p>
        </div>

        {/* Card: Pedagang */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">🏪</div>
          <h3 className="text-xl font-bold text-pg-text mb-2">Pedagang Pasar</h3>
          <p className="text-gray-500 text-sm mb-4">Kelola stok digital dan perluas jangkauan pembeli di sekitar area pasar Anda.</p>
        </div>

        {/* Card: Agen */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-pg-accent text-xs font-bold px-2 py-1 rounded-bl-lg">POPULER</div>
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl mb-4">🛵</div>
          <h3 className="text-xl font-bold text-pg-text mb-2">Agen Gerobak</h3>
          <p className="text-gray-500 text-sm mb-4">Dapatkan penghasilan tambahan dengan mengantar pesanan ke tetangga sekitar.</p>
        </div>
      </section>

    </div>
  );
}