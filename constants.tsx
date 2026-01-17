
import { Property, Booking } from './types';

export const FACILITIES = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'ac', name: 'AC', icon: '❄️' },
  { id: 'bathroom_in', name: 'K. Mandi Dalam', icon: '🚿' },
  { id: 'parking', name: 'Parkir', icon: '🅿️' },
  { id: 'laundry', name: 'Laundry', icon: '🧺' },
  { id: 'security', name: 'Satpam 24h', icon: '👮' },
  { id: 'closet', name: 'Kloset Duduk', icon: '🚽' },
  { id: 'bed', name: 'Kasur', icon: '🛏️' },
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    ownerId: 'admin1',
    name: 'Kost Sukamahi Deltamas Vvip',
    address: 'Jl. Sukamahi',
    city: 'Bekasi',
    area: 'Cikarang Pusat',
    description: 'Kost Vvip dengan fasilitas lengkap di Deltamas.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800',
    basePrice: 1700000,
    facilities: ['wifi', 'ac', 'bathroom_in', 'closet', 'bed'],
    rating: 4.8,
    lat: -6.1847,
    lng: 106.8332,
    gender: 'Putri',
    roomsLeft: 1,
    promoText: 'Promo Akhir Tahun',
    rooms: [
      { id: 'r1', propertyId: 'p1', roomNumber: '101', price: 1700000, isAvailable: true, type: 'SINGLE' }
    ],
    reviews: []
  },
  {
    id: 'p2',
    ownerId: 'admin1',
    name: 'Kost GiiC Sudut Nyaman Vvip',
    address: 'Jl. GiiC No. 12',
    city: 'Bekasi',
    area: 'Cikarang Pusat',
    description: 'Hunian nyaman di kawasan industri GiiC.',
    imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800',
    basePrice: 1800000,
    facilities: ['wifi', 'ac', 'bathroom_in', 'closet', 'bed'],
    rating: 4.5,
    lat: -6.3725,
    lng: 106.8317,
    gender: 'Putri',
    roomsLeft: 1,
    promoText: 'Promo Awal Tahun',
    rooms: [
      { id: 'r4', propertyId: 'p2', roomNumber: 'A1', price: 1800000, isAvailable: true, type: 'SINGLE' }
    ],
    reviews: []
  },
  {
    id: 'p3',
    ownerId: 'admin2',
    name: 'Kost Kamarku Superior Kano',
    address: 'Gading Serpong',
    city: 'Tangerang',
    area: 'Kelapa Dua',
    description: 'Kost superior dengan desain modern.',
    imageUrl: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800',
    basePrice: 2600000,
    facilities: ['wifi', 'ac', 'bathroom_in', 'closet', 'bed'],
    rating: 5.0,
    lat: -6.2345,
    lng: 106.6789,
    gender: 'Campur',
    roomsLeft: 1,
    promoText: 'Promo Awal Tahun',
    rooms: [
      { id: 'r7', propertyId: 'p3', roomNumber: 'B1', price: 2600000, isAvailable: true, type: 'SINGLE' }
    ],
    reviews: []
  },
  {
    id: 'p4',
    ownerId: 'admin3',
    name: 'Kost THE IMAJO Yogyakarta',
    address: 'Jl. Gejayan',
    city: 'Yogyakarta',
    area: 'Depok',
    description: 'Kost strategis di jantung kota Yogyakarta.',
    imageUrl: 'https://images.unsplash.com/photo-1626593371158-662241baf73a?auto=format&fit=crop&q=80&w=800',
    basePrice: 1600000,
    facilities: ['wifi', 'ac', 'bathroom_in', 'closet', 'bed'],
    rating: 4.9,
    lat: -7.7956,
    lng: 110.3695,
    gender: 'Putri',
    roomsLeft: 2,
    promoText: 'gratis 1 bulan',
    rooms: [
      { id: 'r10', propertyId: 'p4', roomNumber: 'C1', price: 1600000, isAvailable: true, type: 'SINGLE' }
    ],
    reviews: []
  }
];

export const MOCK_BOOKINGS: Booking[] = [];
