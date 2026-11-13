import { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { formatRupiah } from '../../utils/formatters';

export default function OrdersPage() {
  const { orders } = useTravel();
  const [tab, setTab] = useState('Aktif'); // 'Aktif' | 'Riwayat'

  const filteredOrders = orders.filter((o) =>
    tab === 'Aktif' ? o.orderStatus === 'Aktif' : o.orderStatus !== 'Aktif'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Daftar Pesanan</h1>
          <p className="text-sm text-stone-500 mt-1">
            Pantau status pembayaran, jadwal perjalanan, dan konfirmasi reservasi tiap destinasi.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-stone-200/70 self-start">
          {['Aktif', 'Riwayat'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                tab === t ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
              }`}
            >
              {t === 'Aktif' ? 'Pesanan Aktif' : 'Sudah Pernah Dipesan'}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-sm text-stone-500">
          Belum ada pesanan pada kategori {tab.toLowerCase()}.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
              {/* Header Multi-Status */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3.5">
                <div>
                  <span className="text-xs font-mono text-stone-400">{order.id} · {order.createdAt}</span>
                  <p className="font-semibold text-stone-900 text-sm mt-0.5">
                    Total: {formatRupiah(order.grandTotal)} ({order.paymentMethod})
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-medium">
                    Pesanan: {order.orderStatus}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 text-xs font-medium">
                    Pembayaran: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Status Reservasi Per Destinasi */}
              <div className="space-y-2.5">
                <p className="text-xs font-medium text-stone-500">Status Reservasi Destinasi:</p>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="text-[11px] font-medium text-stone-400">
                        Hari ke-{item.dayNumber} · Urutan #{item.orderInDay}
                      </span>
                      <h4 className="font-semibold text-sm text-stone-900">{item.destinationName}</h4>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.visitTime} WIB
                        </span>
                        <span>{item.ticketCount} Tiket</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium self-start sm:self-center ${
                        item.reservationStatus === 'Terkonfirmasi'
                          ? 'bg-emerald-900 text-white'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.reservationStatus}
                    </span>
                  </div>
                ))}
              </div>

              {/* Info Titik Jemput */}
              <div className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>
                  Jemput di <strong>{order.pickup?.hotelOrPlace}</strong> ({order.pickup?.landmark}) · Telp: {order.pickup?.phone}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}