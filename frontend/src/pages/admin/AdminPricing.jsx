import { useState } from 'react';
import { Globe, EyeOff } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { formatRupiah } from '../../utils/formatters';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function AdminPricing() {
  const { destinations, pricingList, setPricingList } = useTravel();
  const [selectedDestId, setSelectedDestId] = useState(destinations[0]?.id || '');
  const [samePrice, setSamePrice] = useState(true);
  const [quotaPerDay, setQuotaPerDay] = useState(100);
  const [dailyPrices, setDailyPrices] = useState({
    Senin: 50000, Selasa: 50000, Rabu: 50000, Kamis: 50000, Jumat: 50000, Sabtu: 65000, Minggu: 65000
  });

  const handleSamePriceToggle = (checked) => {
    setSamePrice(checked);
    if (checked) {
      const base = dailyPrices.Senin;
      const uniform = {};
      DAYS.forEach((d) => (uniform[d] = base));
      setDailyPrices(uniform);
    }
  };

  const handleDayPriceChange = (day, val) => {
    const num = Number(val) || 0;
    if (samePrice) {
      const uniform = {};
      DAYS.forEach((d) => (uniform[d] = num));
      setDailyPrices(uniform);
    } else {
      setDailyPrices({ ...dailyPrices, [day]: num });
    }
  };

  const handleSaveAndPublish = (publishStatus) => {
    if (!selectedDestId) return;
    setPricingList((prev) => {
      const exists = prev.find((p) => p.destinationId === selectedDestId);
      const payload = {
        id: exists ? exists.id : `price-${Date.now()}`,
        destinationId: selectedDestId,
        isPublished: publishStatus,
        samePriceAllDays: samePrice,
        dailyPrices,
        quotaPerDay: Number(quotaPerDay)
      };
      return exists
        ? prev.map((p) => (p.destinationId === selectedDestId ? payload : p))
        : [...prev, payload];
    });
  };

  const togglePublish = (destinationId) => {
    setPricingList((prev) =>
      prev.map((p) => (p.destinationId === destinationId ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Manajemen Ketersediaan & Harga Tiket</h1>
        <p className="text-xs text-stone-500">
          Atur tarif harian (weekday/weekend) dan publikasikan agar destinasi muncul di halaman Pembeli.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-stone-500 block mb-1">Pilih Destinasi dari Master Data</label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Ketersediaan Kuota Tiket per Hari</label>
            <input
              type="number"
              value={quotaPerDay}
              onChange={(e) => setQuotaPerDay(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-emerald-900 cursor-pointer">
          <input
            type="checkbox"
            checked={samePrice}
            onChange={(e) => handleSamePriceToggle(e.target.checked)}
          />
          Samakan harga tiket di setiap harinya (Senin – Minggu)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          {DAYS.map((day) => (
            <div key={day} className="p-2.5 rounded-xl bg-[#FAF9F6] border border-stone-200/80">
              <span className="font-medium text-stone-700 block mb-1">{day}</span>
              <input
                type="number"
                disabled={samePrice && day !== 'Senin'}
                value={dailyPrices[day]}
                onChange={(e) => handleDayPriceChange(day, e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-stone-200 bg-white disabled:bg-stone-100"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleSaveAndPublish(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-medium"
          >
            <Globe className="w-3.5 h-3.5" /> Simpan & Publikasikan ke Pembeli
          </button>
          <button
            onClick={() => handleSaveAndPublish(false)}
            className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-medium"
          >
            Simpan sebagai Draft
          </button>
        </div>
      </div>

      {/* Daftar Status Publikasi */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3.5">Destinasi</th>
              <th className="p-3.5">Tarif Weekday / Weekend</th>
              <th className="p-3.5">Kuota/Hari</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pricingList.map((p) => {
              const dest = destinations.find((d) => d.id === p.destinationId);
              if (!dest) return null;
              return (
                <tr key={p.id}>
                  <td className="p-3.5 font-medium text-stone-900">{dest.name}</td>
                  <td className="p-3.5 text-stone-600">
                    {formatRupiah(p.dailyPrices.Senin)} / {formatRupiah(p.dailyPrices.Sabtu)}
                  </td>
                  <td className="p-3.5 text-stone-600">{p.quotaPerDay} tiket</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        p.isPublished ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {p.isPublished ? 'Dipublikasikan' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => togglePublish(p.destinationId)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-stone-200 hover:bg-stone-50"
                    >
                      {p.isPublished ? <><EyeOff className="w-3 h-3" /> Tarik</> : <><Globe className="w-3 h-3" /> Publikasikan</>}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}