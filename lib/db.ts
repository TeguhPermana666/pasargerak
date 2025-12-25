import { Pool, QueryResult, QueryResultRow } from 'pg';

// Kita buat logic yang fleksibel
// Urutan Prioritas:
// 1. POSTGRES_... (Variable otomatis dari Vercel)
// 2. DB_... (Variable manual di Localhost)

const pool = new Pool({
  // OPSI 1: Connection String Langsung (Paling Prioritas)
  connectionString: process.env.POSTGRES_URL, 

  // OPSI 2: Jika Connection String tidak ada, kita rakit manual
  // Kita gunakan operator "||" (OR). Jika kiri kosong, ambil kanan.
  user: process.env.POSTGRES_USER || process.env.DB_USER,
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD,
  host: process.env.POSTGRES_HOST || process.env.DB_HOST,
  database: process.env.POSTGRES_DATABASE || process.env.DB_NAME,
  
  // Port biasanya 5432, tapi aman kalau kita definisikan fallback juga
  port: 5432, 

  // OPSI 3: SSL (Wajib untuk Supabase di Production)
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : undefined,
});

export default pool;

export const query = async <T extends QueryResultRow = any>(
  text: string, 
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  
  try {
    const res = await pool.query<T>(text, params);
    
    // Logging (Opsional, matikan di production agar log bersih)
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - start;
      // console.log('executed query', { text, duration, rows: res.rowCount });
    }
    
    return res;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};