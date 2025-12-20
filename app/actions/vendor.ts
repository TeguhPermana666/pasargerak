'use server'
import pool from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';  
import { redirect } from 'next/navigation';
export async function addProductAction(formData: FormData){
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    if (user.role !== 'VENDOR') {
        return; 
    }

    const data = {
        vendor_id: user.id,
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        image_url: `https://placehold.co/300x200?text=${formData.get('name')}`
    };

    const client = await pool.connect();
    try{
        await client.query(
           `INSERT INTO products (vendor_id, name, description, price, stock, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [data.vendor_id, data.name, data.description, data.price, data.stock, data.image_url] 
        );
    } catch (err) {
        console.error("Gagal tambah produk:", err);
    } finally {
        client.release();
    }
    redirect('/vendor/dashboard');
}

export async function updateStockAction(productId: number, change: number){
    const client = await pool.connect();
    try{
        if (change < 0){
            const check = await client.query('SELECT stock FROM products WHERE id = $1', [productId]);
            if (check.rows[0].stock <= 0) return;
        }
        await client.query(
            `UPDATE products SET stock = stock + $1 WHERE id = $2`,
            [change, productId]
        );
    }catch(err){
        console.error('Update stock failed:', err);
    }finally{
        client.release();
    }
    revalidatePath('/vendor/dashboard');
}

export async function deleteProductAction (productId: number){
    const client = await pool.connect();
    try{
        await client.query(
        'UPDATE products SET is_active = FALSE, stock = 0 WHERE id = $1', 
        [productId]
    );
    }catch(err){
        console.error('Hapus Produk Gagal:', err);
    }finally{
        client.release();
    }
    revalidatePath('/vendor/dashboard');
}