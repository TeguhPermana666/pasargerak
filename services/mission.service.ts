import { query } from "@/lib/db";
// Ambil semua misi (orders) yang BELUM ada agennya (status PENDING)
export async function getAvailableMissions(){
    const sql = `
        SELECT 
            o.id, o.total_price, o.delivery_fee, o.created_at,
            v.name as vendor_name, v.address as pickup_address, v.phone as vendor_phone,
            b.name as buyer_name, b.address as delivery_address,
            (SELECT count(*) FROM order_items WHERE order_id = o.id) as total_items
        FROM orders o
        JOIN users v ON o.vendor_id = v.id
        JOIN users b ON o.buyer_id = b.id
        WHERE  o.status = 'PENDING' AND o.agent_id IS NULL
        ORDER BY o.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
}
// Ambil misi yang SEDANG dikerjakan Agen saat ini
export async function getMyActiveMissions(agentId: number){
    const sql = `
        SELECT 
            o.id, o.status, o.total_price, o.delivery_fee,
            v.name as vendor_name, v.address as pickup_address, v.phone as vendor_phone,
            b.name as buyer_name, b.address as delivery_address, b.phone as buyer_phone,
            o.pickup_token, o.delivery_token
        FROM orders o
        JOIN users v ON o.vendor_id = v.id
        JOIN users b ON o.buyer_id = b.id
        WHERE o.agent_id = $1 AND o.status IN ('ASSIGNED', 'PICKED_UP')
        ORDER BY o.created_at ASC
    `;
    const res = await query(sql, [agentId]);
    return res.rows;
}