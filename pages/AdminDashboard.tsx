
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { properties, bookings } = useAppContext();

  const stats = useMemo(() => {
    const activeBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
    const revenue = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + b.totalPrice, 0);
    const totalRooms = properties.reduce((sum, p) => sum + p.rooms.length, 0);
    const occupiedRooms = properties.reduce((sum, p) => sum + p.rooms.filter(r => !r.isAvailable).length, 0);
    
    return {
      totalRevenue: revenue,
      occupancyRate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
      totalRooms,
      occupiedRooms,
      activeBookings: activeBookings.length
    };
  }, [properties, bookings]);

  // Chart Data
  const propertyOccupancyData = properties.map(p => ({
    name: p.name,
    occupied: p.rooms.filter(r => !r.isAvailable).length,
    total: p.rooms.length
  }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Dashboard Pengelola</h1>
          <p className="text-slate-500">Pantau performa bisnis kost Anda secara real-time.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600">
          📅 Periode: <span className="text-slate-900">Maret 2024</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Pendapatan</p>
          <p className="text-2xl font-black text-slate-900">Rp {stats.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Okupansi</p>
          <p className="text-2xl font-black text-slate-900">{stats.occupancyRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Booking Aktif</p>
          <p className="text-2xl font-black text-slate-900">{stats.activeBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Status Kamar</p>
          <p className="text-2xl font-black text-slate-900">{stats.occupiedRooms}/{stats.totalRooms}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Okupansi per Properti</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={propertyOccupancyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="occupied" radius={[4, 4, 0, 0]}>
                {propertyOccupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Aktivitas Terkini</h3>
          <div className="space-y-6">
            {bookings.slice(0, 5).map(b => (
              <div key={b.id} className="flex items-center gap-4">
                <div className={`w-2 h-10 rounded-full ${b.status === 'CONFIRMED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <div className="flex-grow">
                  <p className="text-sm font-bold text-slate-900">
                    Booking Baru: {properties.find(p => p.id === b.propertyId)?.name}
                  </p>
                  <p className="text-xs text-slate-500">Oleh User ID: {b.tenantId} • Rp {b.totalPrice.toLocaleString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${b.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {b.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
