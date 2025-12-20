'use client';

import { use, useState } from "react";
import { verifyPickupAction, vertifyDeliveryAction } from "@/app/actions/mission";

export default function MissionActions({ orderId, status} : { orderId: number, status: string }) {
   const [isInputting, setIsInputting] = useState(false);
   const [token, setToken] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   
   const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();
    setIsLoading(true);
    
    let result;
    if (status === 'ASSIGNED'){
        result = await verifyPickupAction(orderId, token);
    } else{
        result = await vertifyDeliveryAction(orderId, token);
    }
    if(result.error){
        alert(result.error);
        setIsLoading(false);
    }else{
        setIsInputting(false);
        setToken('');
        setIsLoading(false);
        alert("Berhasil Status Diperharui");
    }
   };
   if (isInputting){
    return(
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2 animate-fade-in-up">
            <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder={status === "ASSIGNED" ? "Kode dari Pedagang" : "Kode dari Pembeli"}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-50"
            >
                {isLoading ? '...' : 'OK'}
            </button>
            <button 
                type="button" 
                onClick={() => setIsInputting(false)}
                className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg font-bold text-sm hover:bg-gray-300"
            >
                X
            </button>
        </form>
    );
   }
    //    Tombol Awal
    if(status === 'ASSIGNED'){
        return(
            <button
                onClick={() => setIsInputting(true)}
                className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
                Input Kode Pick UP (Vendor)
            </button>
        );
    }
    if(status === 'PICKED_UP'){
        return(
            <button
                onClick={() => setIsInputting(true)}
                className="w-full mt-4 bg-green-600 text-whiite font-bold py-3 rounded-lg shadow hover:bg-green-700 transition-colors"
            >
                Input Kode Terima (Pembeli)
            </button>
        );
    }
    return null
}