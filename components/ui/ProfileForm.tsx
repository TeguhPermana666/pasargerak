'use client' 

import { useState } from 'react';
import { updateProfileAction } from '@/app/actions/profile';

type UserProfile = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export default function ProfileForm({ user }: { user: UserProfile }) {
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper function untuk menangani Server Action di Client
  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    
    // Panggil Server Action
    const result = await updateProfileAction(formData);
    
    setIsLoading(false);

    // Tampilkan Feedback ke User
    if (result.error) {
      alert(`❌ Gagal: ${result.error}`);
    } else {
      alert(`✅ ${result.success}`);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
          <input 
            name="name" 
            type="text" 
            defaultValue={user.name} 
            required 
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pg-primary outline-none" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
          <input 
            type="email" 
            value={user.email} 
            disabled 
            className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg p-2.5 text-sm cursor-not-allowed" 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">Nomor WhatsApp</label>
        <input 
          name="phone" 
          type="tel" 
          defaultValue={user.phone || ''} 
          placeholder="Contoh: 08123456789"
          required 
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pg-primary outline-none" 
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1">Alamat Lengkap</label>
        <textarea 
          name="address" 
          defaultValue={user.address || ''} 
          placeholder="Nama jalan, nomor rumah, patokan..."
          rows={3} 
          required 
          className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-pg-primary outline-none"
        ></textarea>
      </div>

      <div className="pt-2 text-right">
        <button 
            type="submit" 
            disabled={isLoading}
            className="bg-pg-primary text-white font-bold px-6 py-2.5 rounded-lg hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </form>
  );
}