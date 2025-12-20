'use server'

import pool from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function checkoutAction(cartItems: any[], totalPrice: number, vendorid: number ){
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) redirect('/login');

    const user = JSON .parse(session.value);
    const client = await pool.connect();
    try{
        await client.query('BEGIN');

        const orderRes = await client.query(
            `INSERT INTO orders (buyer_id, vendor_id, status, total_price, delivery_fee, pickup_token, delivery_token)
            VALUES ($1, $2, 'PENDING', $3, 5000, substr(md5(random()::text), 0, 5), substr(md5(random()::text), 0, 5))
            RETURNING id`,
            [user.id, vendorid, totalPrice]    
        );
        const orderId = orderRes.rows[0].id;

        for (const item of cartItems){
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) 
                VALUES ($1, $2, $3, $4)`,
                [orderId, item.id, item.quantity, item.price]
            );
            await client.query(
                `UPDATE products SET stock = stock - $1 WHERE id = $2`,
                [item.quantity, item.id]
            );
        }
        await client.query('COMMIT');
        return { success: true };
    }catch(err){
        await client.query('ROLLBACK');
        console.error('Checkout failed:', err);
        return { error: "Checkout Gagal, Coba Lagi Nanti!" };
    }finally{
        client.release();
    }
}

