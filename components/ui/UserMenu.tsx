'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';

type User = {
  name: string;
  role: string;
};

export default function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'VENDOR': return 'Pedagang';
      case 'AGENT': return 'Agen Gerobak';
      default: return 'Pembeli';
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      {/* --- TOMBOL PROFILE (Versi Header Hijau) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-green-800 p-2 rounded-lg transition-colors focus:outline-none"
      >
        {/* Avatar: Background Putih, Teks Hijau (Kebalikan Header) */}
        <div className="w-10 h-10 rounded-full bg-white text-pg-primary flex items-center justify-center font-bold text-lg shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {/* Nama & Role: Teks Putih agar terbaca di background hijau */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
          <span className="text-xs font-medium text-white bg-pg-secondary px-2 py-0.5 rounded-full">
            {getRoleLabel(user.role)}
          </span>
        </div>

        {/* Icon Panah Putih */}
        <svg className={`w-4 h-4 text-green-100 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* --- DROPDOWN MENU (Tetap Putih agar bersih) --- */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 origin-top-right text-gray-800">
          
          <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
             <p className="text-sm font-bold text-gray-800">{user.name}</p>
             <p className="text-xs text-gray-500">{getRoleLabel(user.role)}</p>
          </div>
          {user.role === 'VENDOR' && (
            <Link
              href = "/vendor/dashboard"
              onClick={() => setIsOpen(false)}
              className='flex items-center gap-2 px-4 py-3 text-sm font-bold text-pg-primary hover:bg-green-50 transition-colors'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Dashboard Toko
            </Link>
          )}
          {user.role === 'AGENT' && (
            <Link
              href="/agent/dashboard"
              onClick={()=>setIsOpen(false)}
              className='flex items-center gap-2 px-4 py-3 text-sm font-bold text-pg-primary hover:bg-green-50 transition-colors'
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              Misi Pengantaran
            </Link>
          )}
          {user.role === 'BUYER' && (
            <Link 
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-pg-primary hover:bg-green-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              Pesanan Saya
            </Link>
          )}
          {(user.role === 'VENDOR' || user.role === 'AGENT') && (
            <Link 
              href="/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors border-t border-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              Dompet & Riwayat
            </Link>
          )}
          <Link 
            href="/profile" 
            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-pg-primary transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Edit Profil
          </Link>

          <button
            onClick={() => logoutAction()}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}