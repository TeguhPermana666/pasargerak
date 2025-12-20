import { query } from '@/lib/db';

export async function getBuyerOrders(buyerId: number) {
  const sql = `
    SELECT 
      o.id, 
      o.status, 
      -- Pastikan harga dikonversi jadi angka (numeric) agar tidak NaN
      o.total_price::numeric, 
      o.delivery_fee::numeric,
      o.created_at,
      o.delivery_token,
      v.name as vendor_name,
      -- Ambil Detail Barang (Nama & Qty) dalam format JSON
      COALESCE(
        (
          SELECT json_agg(json_build_object('name', p.name, 'quantity', oi.quantity))
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ), 
        '[]'::json
      ) as items,
      -- Hitung total item untuk ditampilkan ringkas
      (SELECT count(*) FROM order_items WHERE order_id = o.id) as total_items
    FROM orders o
    JOIN users v ON o.vendor_id = v.id
    WHERE o.buyer_id = $1
    ORDER BY o.created_at DESC
  `;
  const res = await query(sql, [buyerId]);
  return res.rows;
}