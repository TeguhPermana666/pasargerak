'use client';

import { registerAction } from '@/app/actions/auth'; // Pastikan path ini benar
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-pg-text">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-gray-600">
            Bergabung dengan ekosistem <span className="text-pg-primary font-bold">PasarGerak</span>
          </p>
        </div>

        <form action={async (formData) => { await registerAction(formData); }} className="mt-8 space-y-5">
          
          {/* Group: Role Selection (Visual Emphasis) */}
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
             <label className="block text-sm font-semibold text-pg-primary mb-2">Daftar Sebagai</label>
              <select name="role" className="block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-pg-primary focus:border-pg-primary sm:text-sm rounded-lg shadow-sm">
                <option value="BUYER">👤 Pembeli Rumahan</option>
                <option value="VENDOR">🏪 Pedagang Pasar</option>
                <option value="AGENT">🛵 Agen Gerobak (Kurir)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
             <p className="text-xs text-pg-text mt-2 opacity-75">
               *Pilih peran yang sesuai dengan aktivitas Anda.
             </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input name="name" type="text" required 
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm" 
                placeholder="Contoh: Budi Santoso" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" type="email" required 
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm" 
                placeholder="budi@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input name="password" type="password" required 
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm" 
                placeholder="••••••••" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                  <input name="phone" type="text" required 
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent sm:text-sm" 
                    placeholder="0812..." />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos (Opsional)</label>
                  <input name="zipcode" type="text" 
                    className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent sm:text-sm" 
                    placeholder="12345" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
              <textarea name="address" required rows={3}
                className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm resize-none" 
                placeholder="Jalan, RT/RW, Kelurahan..." />
            </div>
          </div>

          <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-pg-primary hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pg-primary transition-all shadow-md hover:shadow-lg">
            Daftar Sekarang
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Sudah punya akun? <Link href="/login" className="font-bold text-pg-secondary hover:text-orange-700 transition-colors">Login disini</Link>
        </div>
      </div>
    </div>
  );
}