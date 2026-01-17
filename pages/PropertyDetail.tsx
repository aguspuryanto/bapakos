
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FACILITIES } from '../constants';
import { searchNearbyPlaces } from '../services/geminiService';
import { Room } from '../types';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, user, addBooking, updateRoomStatus, bookings, addReview } = useAppContext();
  const property = properties.find(p => p.id === id);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  
  // AI Nearby Search States
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{text: string, chunks: any[]} | null>(null);

  if (!property) return <div className="p-20 text-center">Property not found</div>;

  const canReview = user && bookings.some(b => b.propertyId === id && b.tenantId === user.id && b.status === 'CONFIRMED');

  const handleBooking = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!selectedRoom) return;

    setBookingLoading(true);
    setTimeout(() => {
      addBooking({
        tenantId: user.id,
        propertyId: property.id,
        roomId: selectedRoom.id,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        totalPrice: selectedRoom.price,
        status: 'PENDING',
        paymentStatus: 'UNPAID'
      });
      updateRoomStatus(property.id, selectedRoom.id, false);
      setBookingLoading(false);
      alert('Booking berhasil dikirim! Silakan cek notifikasi untuk detail pembayaran.');
      navigate('/');
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addReview(property.id, {
      userId: user.id,
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    alert('Ulasan berhasil dikirim!');
  };

  const handleAiSearch = async (category: string) => {
    setAiSearchLoading(true);
    const result = await searchNearbyPlaces(property.lat, property.lng, category);
    setAiResult(result);
    setAiSearchLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Property Info */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-8">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl">
              <img src={property.imageUrl} className="w-full h-full object-cover" alt={property.name} />
              <div className="absolute bottom-6 left-6 flex gap-2">
                <button 
                  onClick={() => handleAiSearch('Warung Makan')}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-lg hover:bg-white transition-all flex items-center gap-2"
                >
                  🍱 Cari Makan Terdekat (AI)
                </button>
                <button 
                  onClick={() => handleAiSearch('Minimarket')}
                  className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-lg hover:bg-white transition-all flex items-center gap-2"
                >
                  🛒 Cari Minimarket (AI)
                </button>
              </div>
            </div>

            {aiResult && (
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-indigo-900">✨ Rekomendasi AI Sekitar Kost</h4>
                  <button onClick={() => setAiResult(null)} className="text-indigo-400 hover:text-indigo-600">✕</button>
                </div>
                <p className="text-sm text-indigo-700 leading-relaxed mb-4">{aiResult.text}</p>
                <div className="flex flex-wrap gap-3">
                  {aiResult.chunks.map((chunk: any, i: number) => (
                    chunk.maps && (
                      <a 
                        key={i}
                        href={chunk.maps.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-white text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-600 hover:text-white transition-all font-bold"
                      >
                        📍 {chunk.maps.title || 'Lihat di Peta'}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {aiSearchLoading && (
              <div className="bg-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI sedang mencari lokasi terbaik...</p>
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{property.name}</h1>
                  <p className="text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.address}, {property.city}
                  </p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-2xl">
                  <p className="text-xs font-bold text-indigo-600 uppercase">Rating</p>
                  <p className="text-2xl font-black text-indigo-700">⭐ {property.rating}</p>
                </div>
              </div>
              
              <div className="prose max-w-none text-slate-600 mb-8">
                <p>{property.description}</p>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Fasilitas Utama</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
                {property.facilities.map(fId => {
                  const f = FACILITIES.find(fac => fac.id === fId);
                  return f ? (
                    <div key={fId} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{f.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Ulasan Penghuni</h3>
            
            {canReview && (
              <form onSubmit={handleReviewSubmit} className="mb-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="font-bold text-sm text-slate-900 mb-4">Bagaimana pengalaman Anda?</p>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className={`text-2xl transition-transform hover:scale-125 ${newRating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
                  placeholder="Ceritakan detail kamar, kebersihan, dan pelayanan..."
                  rows={3}
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  required
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                  Kirim Ulasan
                </button>
              </form>
            )}

            <div className="space-y-6">
              {property.reviews.length === 0 ? (
                <p className="text-slate-400 text-center py-8 italic">Belum ada ulasan untuk kost ini.</p>
              ) : (
                property.reviews.map(rev => (
                  <div key={rev.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center font-bold text-indigo-600">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{rev.userName}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-bold text-xs">
                        ⭐ {rev.rating}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Room Selection & Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Pilih Kamar</h3>
            <div className="space-y-4 mb-8">
              {property.rooms.map(room => (
                <button
                  key={room.id}
                  disabled={!room.isAvailable}
                  onClick={() => setSelectedRoom(room)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    !room.isAvailable 
                      ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                      : selectedRoom?.id === room.id
                      ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-100'
                      : 'border-slate-100 hover:border-indigo-200 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-900">Kamar {room.roomNumber}</p>
                      <p className="text-xs text-slate-500">{room.type} Bed • {!room.isAvailable ? 'Terisi' : 'Tersedia'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">Rp {room.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">per bulan</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Harga Sewa</span>
                <span className="font-semibold text-slate-900">Rp {selectedRoom ? selectedRoom.price.toLocaleString() : '0'}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Deposit (Awal)</span>
                <span className="font-semibold text-slate-900">Rp 500.000</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                <span>Total Bayar</span>
                <span className="text-indigo-600">Rp {selectedRoom ? (selectedRoom.price + 500000).toLocaleString() : '0'}</span>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={!selectedRoom || bookingLoading}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  !selectedRoom || bookingLoading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 shadow-xl'
                }`}
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : 'Booking Sekarang'}
              </button>
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  🛡️ Pembayaran Aman Terverifikasi
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  📅 Konfirmasi Langsung dalam 24 Jam
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
