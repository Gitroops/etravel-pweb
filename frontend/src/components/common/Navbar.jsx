import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, ShoppingBag, ReceiptText, User, ShieldCheck } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const { cart, setRole, currentUser } = useTravel();

  const navItems = [
    { to: '/', label: 'Beranda', icon: Compass },
    { to: '/cari', label: 'Cari Wisata', icon: Search },
    { to: '/keranjang', label: 'Keranjang', icon: ShoppingBag, badge: cart.length },
    { to: '/pesanan', label: 'Pesanan', icon: ReceiptText },
    { to: '/akun', label: 'Akun', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-900 text-white flex items-center justify-center font-semibold text-sm">
            J.
          </div>
          <span className="font-semibold tracking-tight text-stone-900 text-lg">
            Jogja<span className="text-emerald-800">Rute</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon, badge }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-sm transition-colors ${
                  active
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {badge > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 text-xs rounded-full bg-emerald-700 text-white font-medium">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {!currentUser && (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-900 text-white text-xs font-medium hover:bg-emerald-800 transition"
            >
              Masuk
            </Link>
          )}
          <button
            onClick={() => setRole('admin')}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
            Mode Admin
          </button>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 flex justify-around py-2 z-50">
        {navItems.map(({ to, label, icon: Icon, badge }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 text-[11px] ${
                active ? 'text-emerald-900 font-semibold' : 'text-stone-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {badge > 0 && (
                <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}