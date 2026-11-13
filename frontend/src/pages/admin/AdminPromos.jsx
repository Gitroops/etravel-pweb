import { useState } from 'react';
import { Tag, Globe } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function AdminPromos() {
  const { destinations, pricingList, promos, setPromos } = useTravel();
  // Hanya destinasi yang sudah terdaftar pada Manajemen Ketersediaan dan Harga
  const eligibleDestinations = destinations.filter((d) =>
    pricingList.some((p) => p.destinationId === d.id)
  );

  const [form, setForm] = useState({
    destinationId: eligibleDestinations[0]?.id || '',
    title: '',
    discountPercent: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    quota: 30
  });

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!form.destinationId || !form.title) return;
    setPromos((prev) => [
      {
        ...form,
        id: `promo-${Date.now()}`,
        discountPercent: Number(form.discountPercent),
        quota: Number(form.quota),
        usedQuota: 0,
        isPublished: true
      },
      ...prev
    ]);
    setForm({ ...form, title: '' });
  };

  const togglePublishPromo = (id) => {
    setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Manajemen Promo Wisata</h1>
        <p className="text-xs text-stone-500">
          Promo yang dipublikasikan otomatis memotong harga tiket di sisi pembeli selama periode & kuota masih berlaku.
        </p>
      </div>

      <form onSubmit={handleCreatePromo} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-stone-500 block mb-1">Pilih Destinasi Terdaftar</label>
            <select
              value={form.destinationId}
              onChange={(e) => setForm({ ...form, destinationId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
            >
              {eligibleDestinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Nama Program Promo</label>
            <input
              required
              placeholder="Contoh: Promo Liburan Sekolah"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Diskon (%)</label>
            <input
              type="number"
              min="1"
              max="90"
              value={form.discountPercent}
              onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Tanggal Berakhir</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <div>
            <label className="text-stone-500 block mb-1">Kuota Tiket Promo</label>
            <input
              type="number"
              min="1"
              value={form.quota}
              onChange={(e) => setForm({ ...form, quota: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200"
            />
          </div>
        </div>

        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 text-white font-medium">
          <Tag className="w-3.5 h-3.5" /> Publikasikan Promo
        </button>
      </form>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3.5">Promo & Destinasi</th>
              <th className="p-3.5">Diskon</th>
              <th className="p-3.5">Periode</th>
              <th className="p-3.5">Kuota Terpakai</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {promos.map((p) => {
              const dest = destinations.find((d) => d.id === p.destinationId);
              return (
                <tr key={p.id}>
                  <td className="p-3.5">
                    <p className="font-semibold text-stone-900">{p.title}</p>
                    <span className="text-stone-500">{dest?.name}</span>
                  </td>
                  <td className="p-3.5 font-semibold text-amber-700">-{p.discountPercent}%</td>
                  <td className="p-3.5 text-stone-600">{p.startDate} s/d {p.endDate}</td>
                  <td className="p-3.5 text-stone-600">{p.usedQuota} / {p.quota}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => togglePublishPromo(p.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium ${
                        p.isPublished ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      <Globe className="w-3 h-3" /> {p.isPublished ? 'Aktif Dipublikasi' : 'Nonaktif'}
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