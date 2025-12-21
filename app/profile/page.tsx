import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserStats } from '@/services/stats.service';
import { getUserProfile } from '@/services/user.service';
import ProfileForm from '@/components/ui/ProfileForm'; 

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session) redirect('/login');
  
  const sessionUser = JSON.parse(session.value);
  const user = await getUserProfile(sessionUser.id);
  
  if (!user) redirect('/login');

  const stats = await getUserStats(user.id, user.role);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
      
      {/* Header Profile (Tetap Sama) */}
      <div className="mb-8 text-center">
         <div className="w-20 h-20 bg-gradient-to-tr from-pg-primary to-green-300 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-3">
            {user.name.charAt(0).toUpperCase()}
         </div>
         <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
         <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block ${
            user.role === 'BUYER' ? 'bg-blue-100 text-blue-800' :
            user.role === 'VENDOR' ? 'bg-orange-100 text-orange-800' :
            'bg-purple-100 text-purple-800'
         }`}>
            {user.role}
         </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                Edit Identitas
             </h2>

             <ProfileForm user={user} />
             
          </div>
        </div>

        <div className="md:col-span-1">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                 📊 Statistik Saya
              </h2>
              
              <div className="space-y-4">
                 <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <p className="text-xs text-blue-600 font-bold uppercase">{stats.label1}</p>
                    <p className="text-xl font-extrabold text-blue-800 mt-1">{stats.value1}</p>
                 </div>

                 <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-xs text-green-600 font-bold uppercase">{stats.label2}</p>
                    <p className="text-xl font-extrabold text-green-800 mt-1">{stats.value2}</p>
                 </div>

                 <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-xs text-orange-600 font-bold uppercase">{stats.label3}</p>
                    <p className="text-xl font-extrabold text-orange-800 mt-1">{stats.value3}</p>
                 </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400">Bergabung sejak {new Date().getFullYear()}</p>
                 <p className="text-[10px] text-gray-300 mt-1">PasarGerak ID: {user.id}</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}