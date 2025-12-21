"use server";
import { createUser, findUserByEmail } from '@/services/auth.service';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Action untuk register
export async function registerAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const phone = formData.get('phone') as string;
    const role = formData.get('role') as string;
    const address = formData.get('address') as string;
    
    if (!email || !password || !role){
        return{ error: "Semua Data Wajib Diisi!"};
    }
    try{
        const existingUser = await findUserByEmail(email);
        if (existingUser){
            return { error: "Email sudah terdaftar!"};
        }
        await createUser({ name, email, password, phone, role, address });
    } catch(err){
        console.error(err);
        return { error: "Gagal Mendaftar, Coba Lagi Nanti!"};
    }
    redirect('/login');
}

// Action untuk login
export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Siapkan variabel untuk menampung tujuan redirect
    let destinationPath = '/';

    try {
        // Cari user
        const user = await findUserByEmail(email);
        if (!user) {
            return { error: 'Email tidak ditemukan!' };
        }
        
        // Cek Password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { error: 'Password Salah!' };
        }

        // Set Session Cookie 
        const sessionData = JSON.stringify({ id: user.id, role: user.role, name: user.name });
        (await cookies()).set('session', sessionData, {
            httpOnly: true, 
            secure : process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/' 
        });

        // 2. Tentukan tujuan redirect BERDASARKAN ROLE user yang sudah ditemukan
        // Tidak perlu fetch ulang ke database
        switch (user.role) {
            case 'AGENT':
                destinationPath = '/agent/dashboard';
                break;
            case 'VENDOR':
                destinationPath = '/vendor/dashboard';
                break;
            case 'BUYER':
            default:
                destinationPath = '/'; // Dashboard pembeli adalah halaman utama
                break;
        }

    } catch (err) {
        console.error("Login Error Details:", err);
        // Return error ke UI agar bisa ditangkap useActionState
        return { error: "Terjadi kesalahan sistem." };
    }
    
    // 3. Eksekusi Redirect di LUAR try-catch
    // Ini penting agar error 'NEXT_REDIRECT' tidak tertangkap oleh catch di atas
    redirect(destinationPath);
}
export async function logoutAction() {
  // Hapus cookie session
  (await cookies()).delete('session');
  
  // Kembalikan ke halaman login
  redirect('/login');
}