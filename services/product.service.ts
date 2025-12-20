import { query } from "@/lib/db";

export async function getAllProducts(){
    const sql = `
        SELECT p.*, u.name as vendor_name, u.address as vendor_location
        FROM products p
        JOIN users u ON p.vendor_id = u.id
        WHERE p.stock > 0
        ORDER BY p.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
}

export async function getVendorProducts(vendorId: number) {
  // Tambahkan WHERE is_active = TRUE
  const sql = `SELECT * FROM products WHERE vendor_id = $1 AND is_active = TRUE ORDER BY id DESC`;
  const res = await query(sql, [vendorId]);
  return res.rows;
}

export async function createProduct(data: any){
    const sql = `
        INSERT INTO products (vendor_id, name, description, price, stock, image_url)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const img = data.image_url || 'https://placehold.co/200x200?text=Sayur';
    const res = await query(sql, [data.vendor_id, data.name, data.description, data.price, data.stock, img]);
    return res.rows[0];
}

export async function getVendorOrders(vendorId: number) {
  const sql = `
    SELECT 
      o.id as order_id, 
      o.status, 
      o.total_price, 
      o.created_at,
      o.pickup_token,
      u.name as buyer_name, 
      u.address as buyer_address,
      COALESCE(
        (
          SELECT json_agg(json_build_object('name', p.name, 'quantity', oi.quantity))
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = o.id
        ), 
        '[]'::json
      ) as items
    FROM orders o
    JOIN users u ON o.buyer_id = u.id
    WHERE o.vendor_id = $1
    ORDER BY o.created_at DESC
  `;
  const res = await query(sql, [vendorId]);
  return res.rows;
}
