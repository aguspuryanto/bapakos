
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ManageTenants: React.FC = () => {
  const { bookings, properties, updateBookingStatus } = useAppContext();

  const handleUpdate = (id: string, status: any, payment: any) => {
    updateBookingStatus(id, status, payment);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Manajemen Penyewa</h1>
        <p className="text-slate-500">Lihat status booking dan verifikasi pembayaran penyewa Anda.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Penyewa</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Properti & Kamar</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Total Harga</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Status Booking</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Pembayaran</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(b => {
                const prop = properties.find(p => p.id === b.propertyId);
                const room = prop?.rooms.find(r => r.id === b.roomId);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://ui-avatars.com/api/?name=${b.tenantId}`} className="w-8 h-8 rounded-full" alt="avatar" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">User ID: {b.tenantId}</p>
                          <p className="text-[10px] text-slate-500">Mulai: {new Date(b.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{prop?.name}</p>
                      <p className="text-xs text-slate-400">No. {room?.roomNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">Rp {b.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                        b.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {b.paymentStatus === 'UNPAID' && (
                          <button 
                            onClick={() => handleUpdate(b.id, 'CONFIRMED', 'PAID')}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700"
                          >
                            Verifikasi Bayar
                          </button>
                        )}
                        <button 
                          onClick={() => handleUpdate(b.id, 'CANCELLED', b.paymentStatus)}
                          className="border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50"
                        >
                          Batalkan
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTenants;
