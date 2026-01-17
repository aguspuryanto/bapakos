
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { generatePropertyDescription } from '../services/geminiService';
import { FACILITIES } from '../constants';
import { Property } from '../types';

const ManageRooms: React.FC = () => {
  const { properties, addProperty, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  const [newProp, setNewProp] = useState<Partial<Property>>({
    name: '',
    city: '',
    address: '',
    description: '',
    basePrice: 0,
    facilities: []
  });

  const handleGenerateAI = async () => {
    if (!newProp.name || !newProp.city) {
      alert("Masukkan nama kost dan kota terlebih dahulu.");
      return;
    }
    setAiLoading(true);
    const desc = await generatePropertyDescription(
      newProp.name || '', 
      newProp.facilities || [], 
      newProp.city || ''
    );
    setNewProp(prev => ({ ...prev, description: desc }));
    setAiLoading(false);
  };

  const handleSave = () => {
    if (!user) return;
    const prop: Property = {
      ...newProp as Property,
      id: `p${Date.now()}`,
      ownerId: user.id,
      imageUrl: 'https://picsum.photos/800/600?random=' + Math.random(),
      rating: 0,
      rooms: [
        { id: `r${Date.now()}1`, propertyId: `p${Date.now()}`, roomNumber: '101', price: newProp.basePrice || 0, isAvailable: true, type: 'SINGLE' },
      ]
    };
    addProperty(prop);
    setIsAdding(false);
    setNewProp({ name: '', city: '', address: '', description: '', basePrice: 0, facilities: [] });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Manajemen Kamar</h1>
          <p className="text-slate-500">Kelola unit properti dan ketersediaan kamar Anda.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          + Tambah Properti
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Tambah Properti Baru</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Kost</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Contoh: Kost Mawar Indah"
                    value={newProp.name}
                    onChange={e => setNewProp({...newProp, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kota</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="Jakarta Pusat"
                    value={newProp.city}
                    onChange={e => setNewProp({...newProp, city: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fasilitas</label>
                <div className="flex flex-wrap gap-2">
                  {FACILITIES.map(f => (
                    <button
                      key={f.id}
                      onClick={() => {
                        const current = newProp.facilities || [];
                        const next = current.includes(f.id) ? current.filter(id => id !== f.id) : [...current, f.id];
                        setNewProp({...newProp, facilities: next});
                      }}
                      className={`px-3 py-2 rounded-xl text-sm transition-all ${
                        newProp.facilities?.includes(f.id) 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.icon} {f.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700">Deskripsi Properti</label>
                  <button 
                    onClick={handleGenerateAI}
                    disabled={aiLoading}
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded"
                  >
                    {aiLoading ? '✨ Menulis...' : '✨ Tulis otomatis pakai AI'}
                  </button>
                </div>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={newProp.description}
                  onChange={e => setNewProp({...newProp, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Harga Dasar Kamar (Rp)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                  value={newProp.basePrice}
                  onChange={e => setNewProp({...newProp, basePrice: parseInt(e.target.value)})}
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Simpan Properti
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Properties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(p => (
          <div key={p.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <div className="h-48 overflow-hidden relative">
              <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <p className="absolute bottom-4 left-4 text-white font-bold">{p.name}</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-slate-500">Kamar Terisi</span>
                <span className="font-bold text-slate-900">{p.rooms.filter(r => !r.isAvailable).length} / {p.rooms.length}</span>
              </div>
              <div className="space-y-3">
                {p.rooms.map(room => (
                  <div key={room.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-bold">No. {room.roomNumber}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${room.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {room.isAvailable ? 'Tersedia' : 'Terisi'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRooms;
