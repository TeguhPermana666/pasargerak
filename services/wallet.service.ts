import { query } from '@/lib/db';

export async function getTransactionHistory(userId: number) {
  const sql = `
    SELECT * FROM transactions 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const res = await query(sql, [userId]);
  return res.rows;
}