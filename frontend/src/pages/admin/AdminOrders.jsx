import { useTravel } from '../../context/TravelContext';
import { formatRupiah } from '../../utils/formatters';

export default function AdminOrders() {
  const { orders, setOrders } = useTravel();

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)));
  };

  const confirmDestinationReservation = (orderId, destIdx) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedItems = o.items.map((item, idx) =>
          idx === destIdx ? { ...item, reservationStatus: 'Terkonfirmasi' } : item
        );
        return { ...o, items: updatedItems };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Manajemen Pesanan & Reservasi Mitra</h1>
        <p className="text-xs text-stone-500">
          Verifikasi pembayaran masuk dan konfirmasi e-tiket pada setiap destinasi pesanan pembeli.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center text-xs text-stone-500">
          Belum ada transaksi pesanan masuk dari pembeli.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="font-mono text-stone-400">{order.id}</span>
                  <h3 className="font-semibold text-sm text-stone-900">
                    {order.customerName} · {formatRupiah(order.grandTotal)}
                  </h3>
                </div>
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
                >
                  <option value="Aktif">Status: Aktif</option>
                  <option value="Selesai">Status: Selesai</option>
                  <option value="Dibatalkan">Status: Dibatalkan</option>
                </select>
              </div>

              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6]">
                    <div>
                      <p className="font-medium text-stone-900">
                        H{item.dayNumber} · {item.destinationName} ({item.date} pukul {item.visitTime})
                      </p>
                      <span className="text-stone-500">{item.ticketCount} Tiket · Status: {item.reservationStatus}</span>
                    </div>
                    {item.reservationStatus !== 'Terkonfirmasi' && (
                      <button
                        onClick={() => confirmDestinationReservation(order.id, idx)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-900 text-white font-medium"
                      >
                        Konfirmasi Tiket
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}