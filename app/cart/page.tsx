'use client';

import { useCart } from '@/context/CartContext';
import { checkoutAction } from '@/app/actions/transaction';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
// 1. Definisikan tipe data item agar TypeScript tidak error
interface CartItem {
  id: number;
  vendor_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CartPage() {
const { cart, addToCart, decreaseFromCart, removeFromCart, total, clearCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Logic Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Kita perlu casting cart[0] sebagai CartItem agar properti vendor_id terbaca
    const firstItem = cart[0] as CartItem;
    const vendorId = firstItem.vendor_id;

    startTransition(async () => {
       const result = await checkoutAction(cart, total, vendorId);
       if (result?.success){
         clearCart(); 
          router.replace('/?success=true');
       } else{
        alert(result?.error || 'Gagal memproses pesanan!!');
       }
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 mb-4">Keranjang belanja kosong.</p>
        <Link href="/" className="text-pg-primary font-bold hover:underline">Mulai Belanja</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-pg-text mb-6">Keranjang Belanja</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {cart.map((item: CartItem) => (
          <div key={item.id} className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Info Produk */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
               <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                 <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-800">{item.name}</h3>
                 <p className="text-sm text-pg-primary font-semibold">Rp {item.price.toLocaleString('id-ID')}</p>
               </div>
            </div>

            {/* Kontrol Kuantitas */}
            <div className="flex items-center gap-6">
                
                {/* Plus Minus Button */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => decreaseFromCart(item.id)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                    >
                        -
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold bg-white min-w-[40px] text-center">
                        {item.quantity}
                    </span>
                    <button 
                        onClick={() => addToCart(item)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 text-gray-600 font-bold transition-colors"
                    >
                        +
                    </button>
                </div>

                {/* Total per Item & Hapus */}
                <div className="text-right min-w-[80px]">
                    <p className="text-sm font-bold text-gray-800">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs hover:underline mt-1">
                      Hapus
                    </button>
                </div>
            </div>

          </div>
        ))}
        
        {/* Footer Cart (Total & Checkout) sama seperti sebelumnya */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Ongkir Agen</span>
            <span>Rp 5.000</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-pg-primary pt-4 border-t border-gray-200">
            <span>Total Bayar</span>
            <span>Rp {(total + 5000).toLocaleString('id-ID')}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isPending}
            className="w-full mt-6 bg-pg-secondary text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Memproses Order...' : 'Checkout Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}