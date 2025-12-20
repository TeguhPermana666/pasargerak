'use server'
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export async function withdrawAction(){
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    const client = await pool.connect();
    try{
        await client.query('BEGIN');
        // Cek Saldo saat ini
        const userRes = await client.query('SELECT wallet_balance FROM users WHERE id = $1', [user.id]);
        const currentBalance = Number(userRes.rows[0].wallet_balance);

        if (currentBalance <= 0){
            await client.query('ROLLBACK');
            return;
        }

        // Nolkan Saldo User
        await client.query(
            `UPDATE users SET wallet_balance = 0 WHERE id = $1`,
            [user.id]
        );
        // Log transaksi DEBIT KELUAR
        await client.query(
            `INSERT INTO transactions (user_id, order_id, type, amount, description) 
            VALUES ($1, NULL, 'WITHDRAWAL', $2, $3)`,
            [user.id, currentBalance, 'Penarikan Dana ke Rekening Bank']
        );
        await client.query('COMMIT');
    }catch(err){
        await client.query('ROLLBACK');
        console.error('Withdraw failed:', err);
    }finally{
        client.release();
    }
    revalidatePath('/wallet');
}