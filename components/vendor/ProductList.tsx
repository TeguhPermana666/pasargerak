'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function ProductList({ products }: { products: any[] }) {
  const { addToCart } = useCart();

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-200 relative">
               <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.vendor_name}</p>
                 </div>
              </div>
              <p className="text-pg-secondary font-bold mb-3">Rp {Number(product.price).toLocaleString('id-ID')}</p>
              
              <button 
                onClick={() => addToCart(product)}
                className="w-full py-2 bg-green-50 text-pg-primary text-sm font-bold rounded-lg hover:bg-pg-primary hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                + Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button (PB-05) */}
      <Link href="/cart" className="fixed bottom-6 right-6 bg-pg-secondary text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-transform hover:scale-105 flex items-center gap-2 z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span className="font-bold">Lihat Keranjang</span>
      </Link>
    </>
  );
}