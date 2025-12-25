import { Pool, QueryResult, QueryResultRow } from 'pg';

// Konfigurasi Pool
const pool = new Pool({
  // 1. Prioritaskan Connection String (Wajib untuk Supabase/Production)
  connectionString: process.env.POSTGRES_URL, 
  
  // 2. Jika POSTGRES_URL tidak ada, gunakan variabel terpisah (Fallback untuk Localhost)
  user: process.env.POSTGRES_URL ? undefined : process.env.DB_USER,
  password: process.env.POSTGRES_URL ? undefined : process.env.DB_PASSWORD,
  host: process.env.POSTGRES_URL ? undefined : process.env.DB_HOST,
  port: process.env.POSTGRES_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
  database: process.env.POSTGRES_URL ? undefined : process.env.DB_NAME,

  // 3. Setting SSL (PENTING untuk Supabase)
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } // Production (Vercel -> Supabase) butuh ini
    : undefined, // Localhost biasanya tidak butuh SSL
});

export default pool;

// Helper Function Query (Tidak berubah, tetap seperti request Anda)
export const query = async <T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  
  const res = await pool.query<T>(text, params);
  
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV === 'development') {
    // console.log('executed query', { text, duration, rows: res.rowCount });
  }
  
  return res;
};