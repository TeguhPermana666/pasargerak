'use server'

import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function updateProfileAction(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session) redirect('/login');
  
  const user = JSON.parse(session.value);
  
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const address = formData.get('address') as string;

  // Validasi sederhana
  if (!name || !phone || !address) {
    return { error: 'Semua kolom wajib diisi!' };
  }

  const client = await pool.connect();
  try {
    // Update Database
    const res = await client.query(
      `UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING id, name, email, role, phone, address, wallet_balance`,
      [name, phone, address, user.id]
    );

    // Update Session (PENTING: Agar data di cookie juga berubah)
    const updatedUser = res.rows[0];
    cookieStore.set('session', JSON.stringify(updatedUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 minggu
        path: '/',
    });

    revalidatePath('/profile');
    return { success: 'Profil berhasil diperbarui!' };

  } catch (err) {
    console.error('Update profile error:', err);
    return { error: 'Gagal memperbarui profil.' };
  } finally {
    client.release();
  }
}