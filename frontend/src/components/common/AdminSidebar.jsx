import { Link, useLocation } from 'react-router-dom';
import {
  MapPin, Ticket, Tag, FileText, ClipboardList, Users, ArrowLeftRight
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const { setRole } = useTravel();

  const menus = [
    { to: '/admin/destinasi', label: '1. Manajemen Destinasi', icon: MapPin },
    { to: '/admin/harga', label: '2. Harga & Ketersediaan', icon: Ticket },
    { to: '/admin/pesanan', label: '3. Pesanan & Reservasi', icon: ClipboardList },
    { to: '/admin/promo', label: '4. Manajemen Promo', icon: Tag },
    { to: '/admin/artikel', label: '5. Artikel Wisata', icon: FileText },
    { to: '/admin/pengguna', label: '6. Manajemen Pengguna', icon: Users }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">Panel Mitra</span>
            <h2 className="font-semibold text-stone-900">JogjaRute Admin</h2>
          </div>
        </div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {menus.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs whitespace-nowrap transition ${
                  active
                    ? 'bg-emerald-900 text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={() => setRole('buyer')}
        className="mt-4 flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-50"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" /> Kembali ke Sisi Pembeli
      </button>
    </aside>
  );
}