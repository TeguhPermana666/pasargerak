'use server'
import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function claimMissionAction(orderId: number){
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');

    const user = JSON.parse(session.value);
    if (user.role !== 'AGENT') return;

    const client = await pool.connect();
    try{
        const result = await client.query(
            `UPDATE orders
                SET agent_id = $1, status = 'ASSIGNED', updated_at = NOW()
                WHERE id = $2 AND agent_id IS NULL AND status = 'PENDING'
            `,[user.id, orderId]
        );
        if (result.rowCount === 0){
            console.error('Misi Sudah tidak tersedia');
        }
    }catch(err){
        console.error('Gagal claim misi', err);
    }finally{
        client.release();
    }
    revalidatePath('/agent/missions');
}

export async function verifyPickupAction(orderId: number, token: string){
    const client = await pool.connect();
    try{
        const res = await client.query(
            `SELECT id FROM orders WHERE id = $1 AND pickup_token = $2 AND status = 'ASSIGNED'`,
            [orderId, token]
        );
        if (res.rowCount === 0){
            return { error: 'Kode Token Salah atau Status Order Tidak Valid!'};
        }
        await client.query(
            `UPDATE orders SET status = 'PICKED_UP', updated_at = NOW() WHERE id = $1`,
            [orderId]
        );
        revalidatePath('/agent/missions');
        return { success: true };
    }catch(err){
        console.error('Gagal verifikasi pickup:', err);
        return { error: 'Gagal Verifikasi Pickup, Coba Lagi Nanti!'};
    }finally{
        client.release();
    }
}


export async function vertifyDeliveryAction(orderId: number, token: string){
    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        // Cek Token & Ambil Data Harga
        const res = await client.query(
            `SELECT id, vendor_id, agent_id, total_price, delivery_fee
            FROM orders WHERE id = $1 AND delivery_token = $2 AND status = 'PICKED_UP'`,
            [orderId, token]
        );
        if (res.rowCount === 0){
            await client.query('ROLLBACK');
            return { error: 'Kode Token Salah atau Pesanan Belum Diambil'};
        }
        const order = res.rows[0];

        await client.query(
            `UPDATE orders SET status = 'COMPLETED', updated_at = NOW() WHERE id = $1`,
            [orderId]
        );
        // Cairkan Dana (Vendor dapat harga barang, agen dapat ongkir)
        // Tambah Saldo Vendor
        await client.query(
            `UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2`,
            [order.total_price, order.vendor_id]
        );
        await client.query(
            `INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'EARNING', $2, $3)`,
            [order.vendor_id, order.total_price, `Penjualan Order #${orderId}`]
        );
        // Tambah Saldo Agen
        await client.query(
            `UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2`,
            [order.delivery_fee, order.agent_id]
        );
        await client.query(
            `INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, 'EARNING', $2, $3)`,
            [order.agent_id, order.delivery_fee, `Komisi Pengantaran Order #${orderId}`]
        );
        await client.query('COMMIT');
        revalidatePath('/agent/missions');
        return { success: true };
    }catch(err){
        await client.query('ROLLBACK');
        console.error('Gagal verifikasi delivery:', err);
        return { error: 'Gagal Verifikasi Delivery, Coba Lagi Nanti!'};
    }finally{
        client.release();
    }
}