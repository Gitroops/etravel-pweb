import { Link, useNavigate } from 'react-router-dom';
import { Trash2, CalendarRange, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { formatRupiah, getEffectivePrice } from '../../utils/formatters';

export default function CartPage() {
  const { cart, toggleCart, publishedDestinations, pricingList, promos } = useTravel();
  const navigate = useNavigate();

  const cartDestinations = publishedDestinations.filter((d) => cart.includes(d.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Keranjang Destinasi</h1>
          <p className="text-sm text-stone-500 mt-1">
            Pilih destinasi yang ingin dikunjungi, lalu lanjutkan ke pengaturan jadwal harian.
          </p>
        </div>
        {cartDestinations.length > 0 && (
          <button
            onClick={() => navigate('/atur-jadwal')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-900 text-white text-sm font-medium hover:bg-emerald-800 transition"
          >
            <CalendarRange className="w-4 h-4" />
            Atur Jadwal ({cartDestinations.length})
          </button>
        )}
      </div>

      {cartDestinations.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center space-y-3">
          <p className="text-sm text-stone-500">Keranjang perjalananmu masih kosong.</p>
          <Link
            to="/cari"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-800 hover:underline"
          >
            Cari destinasi wisata Jogja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {cartDestinations.map((dest) => {
            const price = getEffectivePrice(dest.id, pricingList, promos);
            return (
              <div
                key={dest.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-20 h-20 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {dest.category}
                    </span>
                    <h3 className="font-semibold text-stone-900 mt-1">{dest.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {dest.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {dest.openTime} – {dest.closeTime}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-stone-400 block">Estimasi tiket</span>
                    <span className="font-semibold text-sm text-stone-900">
                      {formatRupiah(price?.finalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleCart(dest.id)}
                    title="Hapus dari keranjang"
                    className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}