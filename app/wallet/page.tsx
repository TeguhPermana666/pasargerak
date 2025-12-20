import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWalletBalance } from '@/services/user.service';
import { getTransactionHistory } from '@/services/wallet.service';
import { withdrawAction } from '@/app/actions/wallet'; // Pastikan path ini benar

export const dynamic = 'force-dynamic';

export default async function WalletPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) redirect('/login');
    const user = JSON.parse(session.value);

    const balance = await getWalletBalance(user.id);
    const transactions = await getTransactionHistory(user.id);

    return (
        <div className='max-w-3xl mx-auto px-4 py-8 min-h-screen bg-gray-50'>
            <h1 className='text-3xl font-extrabold text-gray-900 mb-8'>Dompet Saya</h1>

            {/* --- BAGIAN 1: KARTU SALDO --- */}
            <div className='bg-gradient-to-br from-pg-primary to-green-700 rounded-2xl p-8 text-white shadow-xl mb-10 relative overflow-hidden'>
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                
                <p className='text-green-100 text-sm font-medium mb-2 uppercase tracking-wide'>Total Saldo Aktif</p>
                <h2 className='text-5xl font-bold mb-8'>Rp {balance.toLocaleString('id-ID')}</h2>

                {/* Tombol Tarik Dana (Logic: Hanya aktif jika saldo > 0) */}
                {balance > 0 ? (
                    <form action={withdrawAction}>
                        <button
                            type='submit'
                            className='bg-white text-green-700 font-bold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2'
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            Tarik Dana Sekarang
                        </button>
                    </form>
                ) : (
                    <button disabled className='bg-white/20 text-white/70 font-bold px-6 py-3 rounded-xl cursor-not-allowed flex items-center gap-2'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Saldo Kosong
                    </button>
                )}
            </div>

            {/* --- BAGIAN 2: TABEL RIWAYAT (SELALU MUNCUL) --- */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Riwayat Transaksi
                </h3>

                <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                    {transactions.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">
                            <p className="text-lg">Belum ada riwayat transaksi.</p>
                        </div>
                    ) : (
                        <table className='w-full text-left'>
                            <thead className='bg-gray-100 border-b border-gray-200'>
                                <tr>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider'>Keterangan</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right'>Jumlah</th>
                                    <th className='px-6 py-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-right'>Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((t: any) => {
                                    // Logic Warna
                                    const isCredit = t.type === 'EARNING' || t.type === 'TOPUP' || t.type === 'CREDIT';
                                    
                                    return (
                                        <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                                            {/* Kolom Keterangan */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 text-sm md:text-base">
                                                        {t.description}
                                                    </span>
                                                    <span className={`inline-flex items-center w-fit mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                        isCredit 
                                                            ? 'bg-green-100 text-green-800 border border-green-200' 
                                                            : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                        {t.type}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Kolom Jumlah */}
                                            <td className={`px-6 py-4 text-right font-bold text-sm md:text-base ${
                                                isCredit ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {isCredit ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                                            </td>

                                            {/* Kolom Tanggal */}
                                            <td className="px-6 py-4 text-right text-gray-500 text-xs md:text-sm font-medium">
                                                {new Date(t.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}