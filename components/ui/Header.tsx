import Link from 'next/link';
import { cookies } from 'next/headers';
import UserMenu from './UserMenu';

export default async function Header() {
  // 1. Ambil Session Cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  
  let user = null;
  if (sessionCookie) {
    try {
      user = JSON.parse(sessionCookie.value);
    } catch (e) {
      console.error("Gagal parse session cookie", e);
    }
  }

  return (
    // Style dikembalikan ke bg-pg-primary (Hijau) sesuai request
    <header className="bg-pg-primary text-white shadow-md sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white text-pg-primary p-1.5 rounded-lg font-bold text-xl group-hover:bg-pg-accent transition-colors">
              PG
            </div>
            <span className="font-bold text-xl tracking-tight text-white">PasarGerak</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            
            {/* LOGIC: Show UserMenu if logged in, else show Login/Register buttons */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-white hover:text-pg-accent transition-colors">
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 text-sm font-medium bg-pg-secondary hover:bg-orange-600 text-white rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  Daftar
                </Link>
              </>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}