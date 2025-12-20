import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/vendor/PrintButton';

export default async function PrintLabelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) redirect('/login');

  const sql = `
    SELECT 
      o.id as order_id, o.created_at, o.delivery_fee, o.total_price,
      b.name as buyer_name, b.phone as buyer_phone, b.address as buyer_address,
      v.name as vendor_name, v.phone as vendor_phone, v.address as vendor_address,
      COALESCE(
        (SELECT json_agg(json_build_object('name', p.name, 'qty', oi.quantity)) 
         FROM order_items oi JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = o.id),
        '[]'::json
      ) as items
    FROM orders o
    JOIN users b ON o.buyer_id = b.id
    JOIN users v ON o.vendor_id = v.id
    WHERE o.id = $1
  `;
  
  const res = await query(sql, [id]);
  const order = res.rows[0];

  if (!order) return <div className="p-10 text-center">Order tidak ditemukan</div>;

  return (
    // Gunakan background HEX manual (#ffffff) dan text HEX manual (#000000)
    <div className="max-w-md mx-auto p-4 bg-[#ffffff] min-h-screen text-[#000000] font-mono">
      
      <PrintButton />

      {/* PENTING: 
         1. Gunakan style={{ backgroundColor: 'white' }} eksplisit agar aman.
         2. Ganti semua class warna Tailwind (text-gray-500, border-black) 
            menjadi arbitrary value HEX (text-[#6b7280], border-[#000000]).
      */}
      <div 
        id="label-area" 
        className="border-2 border-[#000000] p-4 bg-[#ffffff]"
        style={{ backgroundColor: '#ffffff', color: '#000000' }} // Double protection
      >
        
        <div className="text-center border-b-2 border-[#000000] pb-2 mb-2">
          <h1 className="text-xl font-bold uppercase text-[#000000]">PasarGerak</h1>
          <p className="text-xs text-[#000000]">Express Delivery</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 border-b border-dashed border-[#000000] pb-4">
          <div>
            {/* Ganti text-gray-500 menjadi text-[#6b7280] */}
            <p className="text-[10px] font-bold uppercase text-[#6b7280]">PENGIRIM</p>
            <p className="font-bold text-[#000000]">{order.vendor_name}</p>
            <p className="text-xs text-[#000000]">{order.vendor_phone}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase text-[#6b7280]">PENERIMA</p>
            <p className="font-bold text-lg text-[#000000]">{order.buyer_name}</p>
            <p className="text-xs text-[#000000]">{order.buyer_phone}</p>
            <p className="text-xs text-[#000000]">{order.buyer_address}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase text-[#6b7280] mb-1">DETAIL BARANG</p>
          <table className="w-full text-sm text-[#000000]">
            <thead>
              <tr className="border-b border-[#000000] text-left">
                <th className="pb-1 text-[#000000]">Item</th>
                <th className="pb-1 text-right text-[#000000]">Qty</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-1 text-[#000000]">{item.name}</td>
                  <td className="py-1 text-right font-bold text-[#000000]">x{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t-2 border-[#000000] pt-2 flex justify-between items-center text-[#000000]">
          <div>
             <p className="text-[10px]">No. Resi</p>
             <p className="text-xl font-bold">#{order.order_id}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px]">Waktu</p>
             <p className="text-xs">{new Date(order.created_at).toLocaleString('id-ID')}</p>
          </div>
        </div>

      </div>
    </div>
  );
}