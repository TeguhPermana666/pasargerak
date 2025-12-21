import { query } from '@/lib/db';

export async function getUserStats(userId: number, role: string) {
  let stats = {
    label1: 'Data 1', value1: '0',
    label2: 'Data 2', value2: '0',
    label3: 'Data 3', value3: '0',
  };

  if (role === 'BUYER') {
    // 1. Total Pengeluaran (Total Harga + Ongkir)
    const resSpent = await query(
      `SELECT SUM(total_price + delivery_fee) as total FROM orders WHERE buyer_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );
    // 2. Total Pesanan Selesai
    const resCount = await query(
      `SELECT COUNT(*) as count FROM orders WHERE buyer_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );
    // 3. Barang Dibeli (Total item)
    const resItems = await query(
      `SELECT SUM(quantity) as total FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.buyer_id = $1 AND o.status = 'COMPLETED'`,
      [userId]
    );

    stats = {
      label1: 'Total Pengeluaran', value1: `Rp ${Number(resSpent.rows[0].total || 0).toLocaleString('id-ID')}`,
      label2: 'Pesanan Selesai', value2: resCount.rows[0].count || '0',
      label3: 'Barang Dibeli', value3: `${resItems.rows[0].total || 0} Item`,
    };
  } 
  
  else if (role === 'VENDOR') {
    // 1. Total Pendapatan Jualan
    const resEarned = await query(
      `SELECT SUM(total_price) as total FROM orders WHERE vendor_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );
    // 2. Produk Aktif
    const resProducts = await query(
      `SELECT COUNT(*) as count FROM products WHERE vendor_id = $1`, 
      [userId]
    );
    // 3. Pesanan Sukses
    const resOrders = await query(
      `SELECT COUNT(*) as count FROM orders WHERE vendor_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );

    stats = {
      label1: 'Total Omzet', value1: `Rp ${Number(resEarned.rows[0].total || 0).toLocaleString('id-ID')}`,
      label2: 'Produk di Etalase', value2: `${resProducts.rows[0].count || 0} Unit`,
      label3: 'Pesanan Sukses', value3: `${resOrders.rows[0].count || 0} Order`,
    };
  } 
  
  else if (role === 'AGENT') {
    // 1. Total Komisi
    const resEarned = await query(
      `SELECT SUM(delivery_fee) as total FROM orders WHERE agent_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );
    // 2. Misi Selesai
    const resMissions = await query(
      `SELECT COUNT(*) as count FROM orders WHERE agent_id = $1 AND status = 'COMPLETED'`, 
      [userId]
    );
    // 3. Misi Aktif (Sedang jalan)
    const resActive = await query(
      `SELECT COUNT(*) as count FROM orders WHERE agent_id = $1 AND status IN ('ASSIGNED', 'PICKED_UP')`, 
      [userId]
    );

    stats = {
      label1: 'Total Komisi', value1: `Rp ${Number(resEarned.rows[0].total || 0).toLocaleString('id-ID')}`,
      label2: 'Misi Selesai', value2: `${resMissions.rows[0].count || 0} Misi`,
      label3: 'Misi Sedang Jalan', value3: `${resActive.rows[0].count || 0} Misi`,
    };
  }

  return stats;
}