export const INITIAL_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Candi Borobudur',
    category: 'Candi',
    location: 'Magelang (Zona Utara)',
    zone: 'UTARA',
    openTime: '06:30',
    closeTime: '17:00',
    avgDurationMinutes: 150,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    description: 'Candi Buddha terbesar di dunia dengan relief sejarah dan panorama perbukitan Menoreh.',
    notes: 'Wajib menggunakan sandal khusus upanat untuk naik ke struktur candi.',
    bookingsCount: 420,
    rating: 4.9,
    views: 1850
  },
  {
    id: 'dest-2',
    name: 'Candi Prambanan',
    category: 'Candi',
    location: 'Sleman (Zona Timur)',
    zone: 'TIMUR',
    openTime: '06:30',
    closeTime: '17:00',
    avgDurationMinutes: 120,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    description: 'Kompleks candi Hindu terbesar di Indonesia yang didedikasikan untuk Trimurti.',
    notes: 'Waktu terbaik berkunjung adalah sore hari menjelang matahari terbenam.',
    bookingsCount: 390,
    rating: 4.8,
    views: 1620
  },
  {
    id: 'dest-3',
    name: 'Museum Ullen Sentalu',
    category: 'Museum',
    location: 'Kaliurang, Sleman (Zona Utara)',
    zone: 'UTARA',
    openTime: '08:30',
    closeTime: '16:00',
    avgDurationMinutes: 90,
    image: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=800&q=80',
    description: 'Museum seni dan budaya Jawa yang menyajikan sejarah peradaban Mataram secara intim.',
    notes: 'Dilarang mengambil foto di beberapa ruang pamer utama; didampingi pemandu.',
    bookingsCount: 280,
    rating: 4.9,
    views: 1100
  },
  {
    id: 'dest-4',
    name: 'Keraton Ngayogyakarta Hadiningrat',
    category: 'Budaya',
    location: 'Kota Yogyakarta (Zona Pusat)',
    zone: 'PUSAT',
    openTime: '08:00',
    closeTime: '14:00',
    avgDurationMinutes: 90,
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
    description: 'Istana resmi Kesultanan Ngayogyakarta Hadiningrat dan pusat pelestarian budaya Jawa.',
    notes: 'Tutup pada hari Senin; pertunjukan gamelan & tari tersedia pukul 10.00 WIB.',
    bookingsCount: 310,
    rating: 4.7,
    views: 1340
  },
  {
    id: 'dest-5',
    name: 'Hutan Pinus Mangunan',
    category: 'Alam',
    location: 'Dlingo, Bantul (Zona Selatan)',
    zone: 'SELATAN',
    openTime: '06:00',
    closeTime: '18:00',
    avgDurationMinutes: 120,
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    description: 'Kawasan hutan pinus sejuk dengan panggung alam terbuka dan pemandangan lembah.',
    notes: 'Suhu cukup dingin di pagi hari, disarankan membawa jaket tipis.',
    bookingsCount: 350,
    rating: 4.8,
    views: 1490
  }
];

export const INITIAL_PRICING = [
  {
    id: 'price-1',
    destinationId: 'dest-1',
    isPublished: true,
    samePriceAllDays: false,
    dailyPrices: {
      Senin: 50000, Selasa: 50000, Rabu: 50000, Kamis: 50000, Jumat: 50000,
      Sabtu: 75000, Minggu: 75000
    },
    quotaPerDay: 100
  },
  {
    id: 'price-2',
    destinationId: 'dest-2',
    isPublished: true,
    samePriceAllDays: false,
    dailyPrices: {
      Senin: 50000, Selasa: 50000, Rabu: 50000, Kamis: 50000, Jumat: 50000,
      Sabtu: 70000, Minggu: 70000
    },
    quotaPerDay: 120
  },
  {
    id: 'price-3',
    destinationId: 'dest-3',
    isPublished: true,
    samePriceAllDays: true,
    dailyPrices: {
      Senin: 50000, Selasa: 50000, Rabu: 50000, Kamis: 50000, Jumat: 50000,
      Sabtu: 50000, Minggu: 50000
    },
    quotaPerDay: 60
  },
  {
    id: 'price-4',
    destinationId: 'dest-4',
    isPublished: true,
    samePriceAllDays: true,
    dailyPrices: {
      Senin: 15000, Selasa: 15000, Rabu: 15000, Kamis: 15000, Jumat: 15000,
      Sabtu: 15000, Minggu: 15000
    },
    quotaPerDay: 150
  },
  {
    id: 'price-5',
    destinationId: 'dest-5',
    isPublished: true,
    samePriceAllDays: false,
    dailyPrices: {
      Senin: 10000, Selasa: 10000, Rabu: 10000, Kamis: 10000, Jumat: 10000,
      Sabtu: 15000, Minggu: 15000
    },
    quotaPerDay: 200
  }
];

export const INITIAL_PROMOS = [
  {
    id: 'promo-1',
    destinationId: 'dest-2',
    title: 'Diskon Senja Prambanan',
    discountPercent: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quota: 50,
    usedQuota: 12,
    isPublished: true
  },
  {
    id: 'promo-2',
    destinationId: 'dest-5',
    title: 'Promo Akhir Pekan Mangunan',
    discountPercent: 30,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quota: 40,
    usedQuota: 8,
    isPublished: true
  }
];

export const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    title: 'Panduan Menyusun Rute Wisata Sehari di Jogja Tanpa Terburu-buru',
    author: 'Tim Kurator Jogja',
    date: '10 Nov 2026',
    readTime: '4 mnt baca',
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Menggabungkan dua destinasi dalam satu hari membutuhkan perhitungan zona wilayah dan jam operasional agar perjalanan tetap nyaman.',
    content: 'Yogyakarta memiliki pembagian zona wisata yang jelas: Utara (Kaliurang & Borobudur), Timur (Prambanan & Ratu Boko), Pusat (Keraton & Malioboro), serta Selatan (Mangunan & Pantai). Menggabungkan dua destinasi dalam satu zona akan menghemat waktu perjalanan hingga 60%.'
  },
  {
    id: 'art-2',
    title: 'Etika dan Aturan Berkunjung ke Candi dan Situs Budaya Jawa',
    author: 'Nadia Kusuma',
    date: '05 Nov 2026',
    readTime: '3 mnt baca',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    excerpt: 'Pelajari aturan berpakaian, penggunaan alas kaki khusus, dan tata krama saat memasuki kawasan cagar budaya.',
    content: 'Setiap situs sejarah di Yogyakarta memiliki aturan pelestarian. Di Candi Borobudur, pengunjung diwajibkan mengenakan sandal upanat untuk menjaga batuan candi dari keausan.'
  }
];

// Matriks estimasi waktu perjalanan antar zona (dalam menit)
export const ZONE_TRAVEL_MINUTES = {
  'UTARA-UTARA': 35,
  'TIMUR-TIMUR': 25,
  'PUSAT-PUSAT': 20,
  'SELATAN-SELATAN': 30,
  'UTARA-PUSAT': 55,
  'PUSAT-UTARA': 55,
  'TIMUR-PUSAT': 40,
  'PUSAT-TIMUR': 40,
  'SELATAN-PUSAT': 50,
  'PUSAT-SELATAN': 50,
  'UTARA-TIMUR': 75,
  'TIMUR-UTARA': 75,
  'TIMUR-SELATAN': 65,
  'SELATAN-TIMUR': 65,
  'UTARA-SELATAN': 105,
  'SELATAN-UTARA': 105,
};