
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FACILITIES } from '../constants';
import MapOverlay from '../components/MapOverlay';

const POPULAR_AREAS = [
  { name: 'Yogyakarta', img: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&q=80&w=600' },
  { name: 'Jakarta', img: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&q=80&w=600' },
  { name: 'Bandung', img: 'https://images.unsplash.com/photo-1590564310418-66304f55a2c2?auto=format&fit=crop&q=80&w=600' },
  { name: 'Surabaya', img: 'https://images.unsplash.com/photo-1610476044719-7988365532d8?auto=format&fit=crop&q=80&w=600' },
];

const LandingPage: React.FC = () => {
  const { properties, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Semua Kota');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.area.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = selectedCity === 'Semua Kota' || p.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [properties, searchTerm, selectedCity]);

  const promoProperties = useMemo(() => properties.filter(p => p.promoText), [properties]);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Utility Bar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center text-[11px] font-medium text-slate-500">
          <div className="flex gap-4">
            <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth={2}/></svg>
              Download App
            </button>
            <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeWidth={2}/></svg>
              Sewa Kos
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <button className="flex items-center gap-1 hover:text-slate-900 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" strokeWidth={2}/></svg>
              Promosikan Iklan Anda
            </button>
          </div>
        </div>
      </div>

      {/* Main Search Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 flex-grow">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#10a35e] rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-bold tracking-tight text-[#10a35e]">mamikos</span>
            </Link>
            
            <div className="flex-grow max-w-xl flex items-center bg-slate-100 rounded-full px-4 border border-transparent focus-within:border-[#10a35e] focus-within:bg-white transition-all">
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              <input 
                type="text" 
                placeholder="Masukan nama lokasi/area/alamat" 
                className="w-full py-2.5 px-3 bg-transparent outline-none text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-[#10a35e] text-white px-6 py-1.5 rounded-full text-sm font-bold ml-2 hover:bg-[#0e8a4f] transition-colors">Cari</button>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <button className="hover:text-[#10a35e] flex items-center gap-1">Cari Apa? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2}/></svg></button>
              <button className="hover:text-[#10a35e]">Pusat Bantuan</button>
            </div>
            {user ? (
               <div className="flex items-center gap-3">
                 <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="avatar" />
               </div>
            ) : (
              <Link to="/auth" className="border border-[#10a35e] text-[#10a35e] px-8 py-2 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors">Masuk</Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {viewMode === 'map' ? (
          <div className="h-[calc(100vh-140px)]">
             <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-900">Peta Interaktif Kost</h2>
               <button 
                  onClick={() => setViewMode('grid')}
                  className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth={2}/></svg>
                 Kembali ke Daftar
               </button>
             </div>
             <MapOverlay properties={filteredProperties} />
          </div>
        ) : (
          <>
            {/* Promo Section */}
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  Kos yang lagi promo di 
                  <div className="relative inline-block">
                    <button className="text-[#10a35e] flex items-center gap-1 border-b-2 border-dashed border-[#10a35e] pb-1 hover:text-[#0e8a4f] transition-colors">
                      {selectedCity}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth={2.5}/></svg>
                    </button>
                  </div>
                </h2>
                <div className="flex items-center gap-4">
                  <button className="text-slate-500 font-bold text-sm border border-slate-200 px-6 py-2 rounded-lg hover:bg-slate-50 transition-colors">Lihat semua</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {promoProperties.map(p => (
                  <Link to={`/property/${p.id}`} key={p.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-sm ${
                          p.gender === 'Putri' ? 'bg-pink-100 text-pink-600' : p.gender === 'Putra' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {p.gender}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black text-orange-600 shadow-sm italic">
                        🔥 Sisa {p.roomsLeft}
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5">
                           <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                             ⭐ {p.rating.toFixed(1)}
                           </span>
                           <span className="text-[10px] text-slate-300">•</span>
                           <span className="text-[11px] text-slate-500 font-medium">Sisa {p.roomsLeft} kamar</span>
                         </div>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-tight line-clamp-2 h-10 group-hover:text-[#10a35e] transition-colors">{p.name}</h3>
                      
                      <div className="flex items-center gap-1 text-slate-500">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={2}/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2}/></svg>
                        <p className="text-[11px] font-medium">{p.area}, {p.city}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {p.facilities.slice(0, 3).map(fId => {
                          const f = FACILITIES.find(fac => fac.id === fId);
                          return f ? (
                            <span key={fId} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-md text-[9px] font-bold flex items-center gap-1">
                              {f.icon} {f.name}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {p.promoText && (
                        <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-2 mt-2">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2}/></svg>
                          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">{p.promoText}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                         <div>
                           <p className="text-[15px] font-black text-slate-900 tracking-tight">
                             Rp{p.basePrice.toLocaleString('id-ID')}
                             <span className="text-[11px] font-medium text-slate-400"> / bulan</span>
                           </p>
                         </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* All Listings Section */}
            <section className="mb-16">
               <h2 className="text-2xl font-bold text-slate-900 mb-8">Rekomendasi Kost Untukmu</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProperties.map(p => (
                    <Link to={`/property/${p.id}`} key={p.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative aspect-video">
                         <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                         <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                         <div className="absolute bottom-3 left-3 flex gap-2">
                           <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                             {p.gender}
                           </span>
                         </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                           <div className="flex items-center text-amber-500 text-[10px] font-bold">
                              ⭐ {p.rating.toFixed(1)}
                           </div>
                           <span className="text-slate-300 text-[10px]">•</span>
                           <span className="text-slate-500 text-[10px]">{p.area}</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-3 group-hover:text-[#10a35e] transition-colors">{p.name}</h3>
                        
                        <div className="flex gap-2 mb-4">
                           {p.facilities.slice(0, 3).map(fId => {
                             const f = FACILITIES.find(fac => fac.id === fId);
                             return f ? <span key={fId} className="text-[11px] text-slate-400">{f.icon}</span> : null;
                           })}
                        </div>

                        <div className="flex items-end justify-between">
                           <p className="font-black text-pink-600 text-sm">
                             Rp{p.basePrice.toLocaleString('id-ID')}
                             <span className="text-[10px] font-medium text-slate-400 uppercase"> / bln</span>
                           </p>
                           <button className="text-[10px] font-black text-[#10a35e] hover:underline uppercase tracking-widest">Detail →</button>
                        </div>
                      </div>
                    </Link>
                  ))}
               </div>
            </section>

            {/* Popular Areas Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Area Kos Terpopuler</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {POPULAR_AREAS.map((area) => (
                  <button key={area.name} className="relative group overflow-hidden rounded-2xl aspect-[1.2/1] shadow-md">
                    <img src={area.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={area.name} />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xl font-bold tracking-tight drop-shadow-lg">Kos {area.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Floating View Map Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
              <button 
                onClick={() => setViewMode('map')}
                className="flex items-center gap-3 bg-[#10a35e] text-white px-8 py-3 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest border-4 border-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeWidth={2.5}/></svg>
                Lihat Map Interaktif
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
