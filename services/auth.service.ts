import { query } from '@/lib/db';
import { QueryResultRow } from 'pg';
import bcrypt from 'bcryptjs';

export interface User extends QueryResultRow {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'BUYER' | 'VENDOR' | 'AGENT';
}

export async function createUser(data: any){
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const sql = `
        INSERT INTO users (name, email, password, phone, role, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, email, role
    `;

    const values = [
        data.name,
        data.email,
        hashedPassword,
        data.phone,
        data.role,
        data.address
    ];
    const result = await query<User>(sql, values);
    return result.rows[0];
}
export async function findUserByEmail(email: string){
    const sql = `SELECT * FROM users WHERE email = $1`;
    const result = await query<User>(sql, [email]);
    return result.rows[0];
}