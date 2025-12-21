import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link'; // Import Link
import { getVendorProducts, getVendorOrders } from '@/services/product.service';
import { addProductAction,updateStockAction, deleteProductAction } from '@/app/actions/vendor'; // Import action baru
import { getWalletBalance } from '@/services/user.service';
export const dynamic = 'force-dynamic';

export default async function VendorDashboard() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) redirect('/login');
  const user = JSON.parse(session.value);
  if (user.role !== 'VENDOR') redirect('/');

  const products = await getVendorProducts(user.id);
  const orders = await getVendorOrders(user.id);

  const currentBalance = await getWalletBalance(user.id);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header (Sama) */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pg-text">Halo, {user.name} 👋</h1>
          <p className="text-gray-600">Lapak Anda siap melayani pelanggan.</p>
        </div>
        <div className="bg-green-100 px-4 py-2 rounded-lg">
          <span className="text-green-800 font-bold">
            Saldo: Rp {currentBalance.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* --- KOLOM KIRI: MANAJEMEN PRODUK --- */}
        <div className="space-y-6">
          {/* Form Tambah (Sama) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-pg-primary mb-4 border-b pb-2">➕ Tambah Barang</h2>
            <form action={addProductAction} className="space-y-4">
              {/* ... Isi Form sama seperti sebelumnya ... */}
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Barang</label>
                <input name="name" required type="text" className="w-full border rounded-lg p-2" placeholder="Cth: Cabe Rawit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">Harga</label>
                    <input name="price" required type="number" className="w-full border rounded-lg p-2" placeholder="5000" />
                 </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Stok</label>
                    <input name="stock" required type="number" className="w-full border rounded-lg p-2" placeholder="10" />
                 </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea name="description" rows={2} className="w-full border rounded-lg p-2"></textarea>
              </div>
              <button type="submit" className="w-full bg-pg-secondary text-white font-bold py-2 rounded-lg hover:bg-orange-600">Simpan</button>
            </form>
          </div>

          {/* LIST PRODUK DENGAN AKSI STOK & HAPUS (NEW) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold text-gray-700 mb-4">📦 Stok Etalase ({products.length})</h3>
             <div className="max-h-80 overflow-y-auto space-y-3 pr-2">
               {products.length === 0 ? (
                 <p className="text-sm text-gray-400 italic">Belum ada barang.</p>
               ) : products.map((p: any) => (
                 <div key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="flex justify-between items-start mb-2">
                     <div>
                       <p className="font-bold text-gray-800">{p.name}</p>
                       <p className="text-xs text-gray-500">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                     </div>
                     
                     {/* Tombol Hapus */}
                     <form action={deleteProductAction.bind(null, p.id)}>
                        <button className="text-red-400 hover:text-red-600 p-1" title="Hapus Produk">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                     </form>
                   </div>
                   
                   {/* Kontrol Stok */}
                   <div className="flex items-center justify-between bg-white rounded border border-gray-200 p-1">
                      <span className="text-xs text-gray-500 pl-2">Stok:</span>
                      <div className="flex items-center gap-2">
                        <form action={updateStockAction.bind(null, p.id, -1)}>
                           <button className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded font-bold text-gray-600">-</button>
                        </form>
                        <span className="font-bold text-sm min-w-[20px] text-center">{p.stock}</span>
                        <form action={updateStockAction.bind(null, p.id, 1)}>
                           <button className="w-6 h-6 bg-pg-primary hover:bg-green-700 text-white rounded font-bold">+</button>
                        </form>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: PESANAN MASUK --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-pg-primary mb-4 border-b pb-2 flex justify-between items-center">
            <span>📋 Pesanan Masuk</span>
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{orders.length} Baru</span>
          </h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-4xl">📭</span>
              <p className="text-gray-500 mt-2">Belum ada pesanan masuk.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.order_id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${order.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : order.status === 'ASSIGNED' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                        {order.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Order #{order.order_id}</p>
                      
                      {/* FIX: Menampilkan Nama Pembeli */}
                      <p className="text-sm font-bold text-gray-800 mt-1 flex items-center gap-1">
                         👤 {order.buyer_name}
                      </p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-pg-text">Rp {Number(order.total_price).toLocaleString('id-ID')}</p>
                       <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Detail Barang */}
                  <div className="bg-white p-3 rounded border border-gray-200 shadow-sm mb-3">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider border-b pb-1">Perlu Dibungkus:</p>
                    <ul className="text-sm text-gray-800 space-y-1">
                      {order.items && order.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b border-gray-100 last:border-0 pb-1">
                          {/* Pastikan memanggil item.name */}
                          <span>{item.name}</span> 
                          {/* Pastikan memanggil item.quantity */}
                          <span className="font-bold">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {(order.status === 'PENDING' || order.status === 'ASSIGNED') && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-3 flex justify-between items-center animate-pulse">
                      <div>
                        <p className="text-[10px] font-bold text-blue-800 uppercase">Kode Pick Up</p>
                        <p className="text-xs text-blue-600">Berikan ke Agen</p>
                      </div>
                      <div className="text-2xl font-mono font-bold text-blue-700 tracking-widest bg-white px-3 py-1 rounded border border-blue-100">
                        {order.pickup_token}
                      </div>
                    </div>
                  )}
                  {/* Tombol Cetak Label (Berfungsi) */}
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                     <p className="text-[10px] text-gray-500 italic max-w-[60%]">
                        *Agen akan memvalidasi saat penjemputan.
                     </p>
                     <a 
                       href={`/vendor/print/${order.order_id}`} 
                       target="_blank" 
                       className="text-xs bg-pg-primary text-white px-3 py-1.5 rounded hover:bg-green-800 flex items-center gap-1 shadow-sm"
                     >
                       🖨️ Cetak Label
                     </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}