
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const AuthPage: React.FC = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TENANT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email, role);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 rotate-3 shadow-xl shadow-indigo-100">K</div>
            <h1 className="text-2xl font-black text-slate-900">Selamat Datang</h1>
            <p className="text-slate-500">Masuk ke akun KostMaster Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Peran</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.TENANT)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${
                    role === UserRole.TENANT 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  Penyewa
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.OWNER)}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${
                    role === UserRole.OWNER 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  Pemilik Kost
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-indigo-600 transition-colors"
                placeholder="email@anda.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
            >
              Masuk Sekarang
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-400">
            Hanya butuh email dan pilih peran untuk demo ini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
