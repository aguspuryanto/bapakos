
export enum UserRole {
  TENANT = 'TENANT',
  OWNER = 'OWNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Facility {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  price: number;
  isAvailable: boolean;
  type: 'SINGLE' | 'DOUBLE' | 'DELUXE';
  currentTenantId?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  area: string;
  description: string;
  imageUrl: string;
  basePrice: number;
  facilities: string[];
  rating: number;
  rooms: Room[];
  reviews: Review[];
  lat: number;
  lng: number;
  gender: 'Putri' | 'Putra' | 'Campur';
  roomsLeft: number;
  promoText?: string;
}

export interface Booking {
  id: string;
  tenantId: string;
  propertyId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PAID';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'SYSTEM';
  isRead: boolean;
  date: string;
}

export interface DashboardStats {
  totalRevenue: number;
  occupanyRate: number;
  totalRooms: number;
  occupiedRooms: number;
  activeBookings: number;
}
