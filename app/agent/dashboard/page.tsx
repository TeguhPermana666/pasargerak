import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAvailableMissions, getMyActiveMissions } from '@/services/mission.service';
import { claimMissionAction } from '@/app/actions/mission';
import MissionActions from '@/components/agent/MissionActions';
// Wajib untuk halaman yang datanya sering berubah (Real-time)
export const dynamic = 'force-dynamic';
import { getWalletBalance } from '@/services/user.service';
export default async function AgentDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) redirect('/login');
  
  const user = JSON.parse(session.value);
  
  // Validasi: Hanya Agent yang boleh masuk sini
  if (user.role !== 'AGENT') redirect('/');

  // Fetch Data
  const availableMissions = await getAvailableMissions();
  const myMissions = await getMyActiveMissions(user.id);
  const currentBalance = await getWalletBalance(user.id);
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      
      {/* Header Dashboard */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Agen 🛵</h1>
          <p className="text-sm text-gray-500">Semangat cari cuan, {user.name}!</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Saldo Dompet</p>
          <p className="font-bold text-green-600 text-lg">
            Rp {currentBalance.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* --- BAGIAN 1: MISI AKTIF (YANG HARUS DIKERJAKAN SEKARANG) --- */}
      {myMissions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-pg-primary mb-3 flex items-center gap-2">
            🚀 Misi Aktif ({myMissions.length})
          </h2>
          
          <div className="space-y-4">
            {myMissions.map((m: any) => (
              <div key={m.id} className="bg-white border-l-4 border-blue-500 rounded-r-xl shadow-md p-5 relative overflow-hidden">
                
                {/* Badge Status */}
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                  STATUS: {m.status}
                </div>

                <div className="flex justify-between items-end mb-4">
                  <h3 className="font-bold text-xl">Order #{m.id}</h3>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Komisi</p>
                    <p className="font-bold text-green-600">Rp {Number(m.delivery_fee).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Info Rute (Vendor -> Buyer) */}
                <div className="space-y-3 relative">
                  {/* Garis Putus-putus Konektor */}
                  <div className="absolute left-[11px] top-8 bottom-4 w-0.5 border-l-2 border-dashed border-gray-200"></div>

                  {/* Lokasi Jemput */}
                  <div className="flex gap-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">🏪</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase">Ambil Barang</p>
                      <p className="font-bold text-gray-800">{m.vendor_name}</p>
                      <p className="text-sm text-gray-600">{m.pickup_address}</p>
                      {/* Link Maps ke Vendor (Diperbaiki) */}
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.pickup_address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        📍 Peta ke Lokasi
                      </a>
                    </div>
                  </div>

                  {/* Lokasi Antar */}
                  <div className="flex gap-3 relative z-10 pt-2">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs">🏠</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-500 uppercase">Antar Ke</p>
                      <p className="font-bold text-gray-800">{m.buyer_name}</p>
                      <p className="text-sm text-gray-600">{m.delivery_address}</p>
                      {/* Link Maps ke Buyer (Diperbaiki) */}
                      <a 
                         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.delivery_address)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        📍 Peta ke Lokasi
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi (Nanti diimplementasikan di PB-09 & PB-10) */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <MissionActions orderId={m.id} status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- BAGIAN 2: POOLING MISI (TERSEDIA) --- */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
          📡 Misi Tersedia ({availableMissions.length})
        </h2>
        
        {availableMissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
             <div className="text-4xl mb-2">😴</div>
             <p className="text-gray-500">Sepi nih, belum ada order masuk.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {availableMissions.map((m: any) => (
              <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-pg-secondary transition-all">
                <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                        {m.total_items} Item
                      </span>
                      <span className="text-gray-400 text-xs">•</span>
                      <span className="text-xs text-gray-500">Baru saja</span>
                   </div>
                   <span className="font-bold text-green-600">Rp {Number(m.delivery_fee).toLocaleString('id-ID')}</span>
                </div>

                {/* Ringkasan Rute */}
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                   <span className="font-bold truncate max-w-[40%]">{m.vendor_name}</span>
                   <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                   <span className="truncate max-w-[40%]">{m.buyer_name}</span>
                </div>

                <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                    📍 {m.pickup_address}
                </div>

                {/* Form Action Claim */}
                <form action={claimMissionAction.bind(null, m.id)}>
                   <button type="submit" className="w-full border-2 border-pg-secondary text-pg-secondary font-bold py-2 rounded-lg hover:bg-pg-secondary hover:text-white transition-colors uppercase text-sm tracking-wide">
                     Ambil Misi Ini
                   </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}