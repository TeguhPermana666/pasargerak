import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getBuyerOrders } from '@/services/order.service';

export const dynamic = 'force-dynamic';

export default async function BuyerOrdersPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) redirect('/login');
  const user = JSON.parse(session.value);
  if (user.role !== 'BUYER') redirect('/');

  const orders = await getBuyerOrders(user.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-pg-text mb-6">📦 Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <p className="text-gray-500">Belum ada riwayat pesanan.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
               
               {/* HEADER PESANAN */}
               <div className="p-5 border-b border-gray-100">
                 <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                    <div>
                      {/* Badge Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-2 font-medium">{new Date(order.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <h3 className="font-bold text-lg text-pg-text">{order.vendor_name}</h3>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      {/* Perbaikan Harga NaN: Sekarang data sudah numeric */}
                      <p className="font-bold text-pg-primary text-xl">
                        Rp {(Number(order.total_price) + Number(order.delivery_fee)).toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{order.total_items} Item</p>
                    </div>
                 </div>

                 {/* DETAIL ITEM PESANAN (BARU DITAMBAHKAN) */}
                 <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Rincian Barang</p>
                    <ul className="space-y-1 text-sm">
                       {order.items && order.items.map((item: any, idx: number) => (
                         <li key={idx} className="flex justify-between">
                           <span>{item.name}</span>
                           <span className="font-bold">x{item.quantity}</span>
                         </li>
                       ))}
                    </ul>
                 </div>
               </div>

               {/* --- TOKEN PEMBELI & INFO AGEN --- */}
               <div className="px-5 py-4 bg-gray-50">
                 {(order.status === 'PICKED_UP' || order.status === 'ASSIGNED') && (
                   <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="text-center sm:text-left">
                         <p className="font-bold text-green-800 uppercase text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Kode Terima Barang
                         </p>
                         <p className="text-xs text-green-600">Sebutkan ke Agen saat barang sampai</p>
                      </div>
                      <div className="text-2xl font-mono font-bold text-green-700 tracking-[0.2em] bg-white px-5 py-2 rounded-lg shadow-sm border border-green-100">
                         {order.delivery_token}
                      </div>
                   </div>
                 )}

                 {order.status === 'PENDING' && (
                   <p className="text-sm text-center text-gray-500 italic flex items-center justify-center gap-2">
                     <svg className="w-5 h-5 animate-spin text-pg-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     Menunggu Agen mengambil pesanan...
                   </p>
                 )}
                 
                 {order.status === 'COMPLETED' && (
                   <p className="text-sm text-center text-green-600 font-bold flex items-center justify-center gap-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     Pesanan Selesai. Terima kasih!
                   </p>
                 )}
               </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}