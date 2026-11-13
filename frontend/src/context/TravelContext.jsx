import { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_DESTINATIONS,
  INITIAL_PRICING,
  INITIAL_PROMOS,
  INITIAL_ARTICLES
} from '../data/initialData';

const TravelContext = createContext();

const DEFAULT_USER = {
  id: 'usr-1',
  name: 'Raka Pratama',
  email: 'raka.pratama@email.com',
  phone: '081234567890',
  language: 'ID',
  status: 'Aktif'
};

export function TravelProvider({ children }) {
  const [role, setRole] = useState('buyer'); // 'buyer' | 'admin'
  
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem('etravel_destinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [pricingList, setPricingList] = useState(() => {
    const saved = localStorage.getItem('etravel_pricing');
    return saved ? JSON.parse(saved) : INITIAL_PRICING;
  });

  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem('etravel_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('etravel_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('etravel_cart');
    return saved ? JSON.parse(saved) : ['dest-1', 'dest-3'];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('etravel_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('etravel_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // State usersList dengan akun default dan admin dimasukkan ke dalam komponen
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('etravel_users_list');
    return saved
      ? JSON.parse(saved)
      : [
          { ...DEFAULT_USER, password: 'password123', role: 'buyer' },
          {
            id: 'usr-admin',
            name: 'Admin JogjaRute',
            email: 'admin@jogjarute.id',
            phone: '081122334455',
            password: 'admin123',
            language: 'ID',
            role: 'admin',
            status: 'Aktif'
          }
        ];
  });

  // Semua useEffect dikumpulkan di dalam komponen
  useEffect(() => localStorage.setItem('etravel_destinations', JSON.stringify(destinations)), [destinations]);
  useEffect(() => localStorage.setItem('etravel_pricing', JSON.stringify(pricingList)), [pricingList]);
  useEffect(() => localStorage.setItem('etravel_promos', JSON.stringify(promos)), [promos]);
  useEffect(() => localStorage.setItem('etravel_articles', JSON.stringify(articles)), [articles]);
  useEffect(() => localStorage.setItem('etravel_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('etravel_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('etravel_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('etravel_users_list', JSON.stringify(usersList)), [usersList]);

  // Fungsi Login & Register dimasukkan ke dalam komponen agar bisa mengakses state
  const loginUser = (email, password) => {
    const found = usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, message: 'Email atau password tidak sesuai.' };
    }
    if (found.status !== 'Aktif') {
      return { success: false, message: 'Akun Anda sedang dinonaktifkan oleh Admin.' };
    }
    setCurrentUser(found);
    setRole(found.role || 'buyer');
    return { success: true, role: found.role || 'buyer' };
  };

  const registerUser = ({ name, email, phone, password }) => {
    const exists = usersList.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar. Silakan masuk.' };
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      password,
      language: 'ID',
      role: 'buyer',
      status: 'Aktif'
    };
    setUsersList((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setRole('buyer');
    return { success: true };
  };

  // Destinasi yang sudah dipublikasikan oleh Admin di Manajemen Ketersediaan & Harga
  const publishedDestinations = destinations.filter((dest) =>
    pricingList.some((p) => p.destinationId === dest.id && p.isPublished)
  );

  // Cart Actions
  const toggleCart = (destinationId) => {
    setCart((prev) =>
      prev.includes(destinationId) ? prev.filter((id) => id !== destinationId) : [...prev, destinationId]
    );
  };

  // Checkout & Buat Pesanan
  const createOrder = (orderPayload) => {
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('id-ID'),
      userId: currentUser?.id || 'guest',
      customerName: currentUser?.name || 'Tamu',
      orderStatus: 'Aktif', // Aktif | Selesai | Dibatalkan
      paymentStatus: 'Lunas', // Menunggu Pembayaran | Lunas
      ...orderPayload
    };

    // Kurangi kuota promo jika destinasi menggunakan promo aktif
    const today = new Date().toISOString().split('T')[0];
    setPromos((prev) =>
      prev.map((promo) => {
        const usedInOrder = orderPayload.items.find((item) => item.destinationId === promo.destinationId);
        if (usedInOrder && promo.isPublished && promo.startDate <= today && promo.endDate >= today) {
          return { ...promo, usedQuota: Math.min(promo.quota, promo.usedQuota + usedInOrder.ticketCount) };
        }
        return promo;
      })
    );

    // Tambah skor popularitas destinasi
    setDestinations((prev) =>
      prev.map((d) => {
        const ordered = orderPayload.items.find((i) => i.destinationId === d.id);
        return ordered ? { ...d, bookingsCount: d.bookingsCount + ordered.ticketCount } : d;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    // Hapus destinasi yang sudah di-checkout dari keranjang
    const orderedIds = orderPayload.items.map((i) => i.destinationId);
    setCart((prev) => prev.filter((id) => !orderedIds.includes(id)));
    return newOrder;
  };

  return (
    <TravelContext.Provider
      value={{
        loginUser,
        registerUser,
        role,
        setRole,
        destinations,
        setDestinations,
        publishedDestinations,
        pricingList,
        setPricingList,
        promos,
        setPromos,
        articles,
        setArticles,
        cart,
        toggleCart,
        orders,
        setOrders,
        createOrder,
        currentUser,
        setCurrentUser,
        usersList,
        setUsersList
      }}
    >
      {children}
    </TravelContext.Provider>
  );
}

export const useTravel = () => useContext(TravelContext);