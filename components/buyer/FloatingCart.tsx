'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FloatingCart() {
  const { cart, totalItems, total } = useCart();
  const [isExpanded, setIsExpanded] = useState(true); // Default terbuka
  const [isBouncing, setIsBouncing] = useState(false);

  // Efek 1: Bounce tombol saat ada update
  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  // Efek 2: Otomatis expand/muncul saat ada barang baru ditambahkan
  useEffect(() => {
    if (totalItems > 0) {
      setIsExpanded(true); 
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      
      {/* --- LIST ITEM (MUNCUL MEMANJANG KE ATAS) --- */}
      {/* Kita gunakan transition height/opacity agar halus */}
      <div 
        className={`bg-white rounded-xl shadow-xl border border-gray-200 w-72 overflow-hidden transition-all duration-300 origin-bottom ${
          isExpanded 
            ? 'opacity-100 scale-100 translate-y-0 max-h-[60vh]' // Max height 60% layar agar tidak kepanjangan
            : 'opacity-0 scale-95 translate-y-10 max-h-0 pointer-events-none'
        }`}
      >
        {/* Header List */}
        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-b border-gray-100">
          <span className="text-xs font-bold text-gray-500">Rincian Pesanan</span>
          <button 
            onClick={() => setIsExpanded(false)} 
            className="text-gray-400 hover:text-gray-600"
            title="Sembunyikan List"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        {/* Scrollable Items */}
        <div className="overflow-y-auto max-h-60 p-2 space-y-1">
           {cart.map((item: any) => (
             <div key={item.id} className="flex gap-3 items-center p-2 bg-white rounded hover:bg-gray-50 transition-colors animate-fade-in-up">
                {/* Gambar Kecil */}
                <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                   <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                </div>
                
                {/* Detail */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-bold text-gray-800 truncate pr-2">{item.name}</p>
                    <span className="text-xs font-semibold text-pg-primary">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
             </div>
           ))}
        </div>
      </div>


      {/* --- TOMBOL UTAMA (CHECKOUT / EXPAND) --- */}
      <div className="flex items-center gap-2">
        
        {/* Tombol Kecil untuk Expand jika sedang di-minimize */}
        {!isExpanded && (
            <button 
                onClick={() => setIsExpanded(true)}
                className="bg-white text-gray-600 p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all animate-bounce-small"
                title="Lihat Rincian"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
            </button>
        )}

        {/* Tombol Besar ke Cart */}
        <Link 
            href="/cart"
            className={`bg-pg-secondary text-white px-5 py-3 rounded-full shadow-lg hover:bg-orange-600 flex items-center gap-3 transition-transform duration-300 ${
            isBouncing ? 'scale-105 bg-orange-500' : 'scale-100'
            }`}
        >
            <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span className="absolute -top-2 -right-2 bg-white text-pg-secondary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                    {totalItems}
                </span>
            </div>
            
            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] opacity-90 uppercase font-semibold tracking-wider">Total</span>
                <span className="font-bold text-sm">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            <div className="bg-white/20 p-1.5 rounded-full ml-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </Link>
      </div>

    </div>
  );
}