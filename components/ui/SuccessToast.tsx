'use client'; // Wajib, agar bisa pakai useEffect (timer)

import { useState, useEffect } from 'react';

export default function SuccessToast() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set timer selama 4 detik (4000ms)
    const timer = setTimeout(() => {
      setIsVisible(false); // Hilangkan notifikasi
    }, 4000);

    // Bersihkan timer jika komponen di-unmount (agar tidak error)
    return () => clearTimeout(timer);
  }, []);

  // Jika isVisible false, jangan tampilkan apa-apa
  if (!isVisible) return null;

  return (
    <div className="fixed top-24 right-4 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center gap-2 animate-bounce transition-opacity duration-500">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <div>
        <strong className="font-bold">Pesanan Berhasil!</strong>
        <span className="block sm:inline"> Mohon tunggu Agen menghubungi Anda.</span>
      </div>
    </div>
  );
}