
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Property, Booking, UserRole, Notification, Review } from '../types';
import { MOCK_PROPERTIES, MOCK_BOOKINGS } from '../constants';

interface AppContextType {
  user: User | null;
  properties: Property[];
  bookings: Booking[];
  notifications: Notification[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBookingStatus: (id: string, status: Booking['status'], payment: Booking['paymentStatus']) => void;
  addProperty: (property: Property) => void;
  updateRoomStatus: (propId: string, roomId: string, available: boolean) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markNotificationsRead: () => void;
  addReview: (propertyId: string, review: Omit<Review, 'id' | 'date' | 'userName'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('kost_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Automatic Notification System for Unpaid Bookings
  useEffect(() => {
    if (user && user.role === UserRole.TENANT) {
      const unpaid = bookings.filter(b => b.tenantId === user.id && b.paymentStatus === 'UNPAID');
      unpaid.forEach(b => {
        const alreadyNotified = notifications.some(n => 
          n.userId === user.id && 
          n.type === 'PAYMENT' && 
          n.message.includes(b.id)
        );
        
        if (!alreadyNotified) {
          addNotification({
            userId: user.id,
            title: 'Peringatan Pembayaran',
            message: `Booking dengan ID ${b.id} belum dibayar. Mohon segera selesaikan pembayaran.`,
            type: 'PAYMENT'
          });
        }
      });
    }
  }, [user, bookings]);

  const login = (email: string, role: UserRole) => {
    const mockUser: User = {
      id: role === UserRole.OWNER ? 'admin1' : 'user1',
      name: role === UserRole.OWNER ? 'Budi Pemilik' : 'Andi Penyewa',
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${role === UserRole.OWNER ? 'BP' : 'AP'}`
    };
    setUser(mockUser);
    localStorage.setItem('kost_user', JSON.stringify(mockUser));
    
    addNotification({
      userId: mockUser.id,
      title: 'Sistem Aktif',
      message: `Selamat datang kembali, ${mockUser.name}.`,
      type: 'SYSTEM'
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kost_user');
    setNotifications([]);
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `n${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const booking: Booking = { ...newBooking, id: `b${Date.now()}` };
    setBookings(prev => [...prev, booking]);
    
    // Notify Owner Automatically
    const prop = properties.find(p => p.id === newBooking.propertyId);
    if (prop) {
      addNotification({
        userId: prop.ownerId,
        title: 'Pesanan Masuk',
        message: `Ada pesanan kamar baru di ${prop.name}. Silakan cek manajemen penyewa.`,
        type: 'BOOKING'
      });
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status'], payment: Booking['paymentStatus']) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status, paymentStatus: payment } : b);
      const booking = updated.find(b => b.id === id);
      if (booking && payment === 'PAID') {
        addNotification({
          userId: booking.tenantId,
          title: 'Pembayaran Dikonfirmasi',
          message: `Terima kasih! Pembayaran untuk booking ${id} telah kami terima.`,
          type: 'PAYMENT'
        });
      }
      return updated;
    });
  };

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const updateRoomStatus = (propId: string, roomId: string, available: boolean) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propId) {
        return {
          ...p,
          rooms: p.rooms.map(r => r.id === roomId ? { ...r, isAvailable: available } : r)
        };
      }
      return p;
    }));
  };

  const addReview = (propertyId: string, reviewData: Omit<Review, 'id' | 'date' | 'userName'>) => {
    if (!user) return;
    const newReview: Review = {
      ...reviewData,
      id: `rev${Date.now()}`,
      userName: user.name,
      date: new Date().toISOString().split('T')[0]
    };
    
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const newReviews = [...p.reviews, newReview];
        const avgRating = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return { ...p, reviews: newReviews, rating: parseFloat(avgRating.toFixed(1)) };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      user, properties, bookings, notifications, login, logout, 
      addBooking, updateBookingStatus, addProperty, updateRoomStatus,
      addNotification, markNotificationsRead, addReview
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
