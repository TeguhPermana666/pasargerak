'use client';

import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react'; // Import hook ini

export default function LoginPage() {
  // Setup state untuk menangkap balasan dari server (error/success)
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-pg-text">Selamat Datang Kembali</h2>
          <p className="mt-2 text-sm text-gray-600">Masuk untuk mulai bertransaksi di PasarGerak</p>
        </div>

        {/* Tampilkan Error Jika Ada */}
        {state?.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center mb-4 border border-red-200">
            {state.error}
          </div>
        )}

        {/* Gunakan 'action' dari hook di sini */}
        <form action={action} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                name="email" 
                type="email" 
                required 
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm" 
                placeholder="email@anda.com" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium text-pg-info hover:text-blue-800">Lupa password?</a>
              </div>
              <input 
                name="password" 
                type="password" 
                required 
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-primary focus:border-transparent transition-all sm:text-sm" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-pg-primary hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pg-primary transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun? <Link href="/register" className="font-bold text-pg-secondary hover:text-orange-700 transition-colors">Daftar disini</Link>
        </div>
      </div>
    </div>
  );
}