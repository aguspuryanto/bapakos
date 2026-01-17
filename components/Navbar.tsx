
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, logout, notifications, markNotificationsRead } = useAppContext();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead && n.userId === user?.id).length;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              KostMaster
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-indigo-600 transition-colors">Cari Kost</Link>
            {user?.role === UserRole.OWNER && (
              <>
                <Link to="/admin" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                <Link to="/admin/rooms" className="hover:text-indigo-600 transition-colors">Manajemen Kamar</Link>
                <Link to="/admin/tenants" className="hover:text-indigo-600 transition-colors">Penyewa</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifs(!showNotifs); markNotificationsRead(); }}
                  className="p-2 text-slate-500 hover:text-indigo-600 transition-colors relative"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[8px] text-white items-center justify-center font-bold">{unreadCount}</span>
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Notifikasi</h3>
                      <button onClick={() => setShowNotifs(false)} className="text-xs text-slate-400">Tutup</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.filter(n => n.userId === user.id).length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Tidak ada notifikasi baru</div>
                      ) : (
                        notifications.filter(n => n.userId === user.id).map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                            <p className="text-xs font-bold text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2">{new Date(n.date).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{user.role}</p>
                </div>
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
                <button 
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200">
                Masuk / Daftar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
