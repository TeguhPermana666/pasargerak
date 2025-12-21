import { query } from '@/lib/db';

export async function getWalletBalance(userId: number) {
  const sql = `SELECT wallet_balance FROM users WHERE id = $1`;
  const res = await query(sql, [userId]);
  
  // Kembalikan saldo (jika null anggap 0)
  return Number(res.rows[0]?.wallet_balance || 0);
}
export async function getUserProfile(userId: number) {
  const sql = `SELECT id, name, email, role, phone, address FROM users WHERE id = $1`;
  const res = await query(sql, [userId]);
  return res.rows[0];
}