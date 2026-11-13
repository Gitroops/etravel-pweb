import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

const EMPTY_FORM = {
  name: '', category: 'Candi', location: '', zone: 'PUSAT',
  openTime: '08:00', closeTime: '17:00', avgDurationMinutes: 120,
  image: '', description: '', notes: ''
};

export default function AdminDestinations() {
  const { destinations, setDestinations } = useTravel();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;
    if (editingId) {
      setDestinations((prev) => prev.map((d) => (d.id === editingId ? { ...d, ...form } : d)));
      setEditingId(null);
    } else {
      setDestinations((prev) => [
        {
          ...form,
          id: `dest-${Date.now()}`,
          image: form.image || 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80',
          bookingsCount: 10,
          rating: 4.8,
          views: 50
        },
        ...prev
      ]);
    }
    setForm(EMPTY_FORM);
  };

  const handleEdit = (dest) => {
    setEditingId(dest.id);
    setForm(dest);
  };

  const handleDelete = (id) => {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Manajemen Destinasi</h1>
        <p className="text-xs text-stone-500">Tambah dan kelola master data tempat wisata Yogyakarta.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-stone-900">
          {editingId ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <input
            required
            placeholder="Nama Destinasi"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 rounded-xl border border-stone-200"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white"
          >
            {['Candi', 'Museum', 'Budaya', 'Alam'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={form.zone}
            onChange={(e) => setForm({ ...form, zone: e.target.value })}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white"
          >
            <option value="UTARA">Zona Utara (Sleman/Magelang)</option>
            <option value="TIMUR">Zona Timur (Prambanan)</option>
            <option value="PUSAT">Zona Pusat (Kota Jogja)</option>
            <option value="SELATAN">Zona Selatan (Bantul/Gunungkidul)</option>
          </select>
          <input
            placeholder="Lokasi Lengkap (Contoh: Sleman, DIY)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="px-3 py-2 rounded-xl border border-stone-200"
          />
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Buka:</span>
            <input
              type="time"
              value={form.openTime}
              onChange={(e) => setForm({ ...form, openTime: e.target.value })}
              className="flex-1 px-2.5 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Tutup:</span>
            <input
              type="time"
              value={form.closeTime}
              onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
              className="flex-1 px-2.5 py-2 rounded-xl border border-stone-200"
            />
          </div>
          <input
            placeholder="URL Foto Destinasi"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="sm:col-span-3 px-3 py-2 rounded-xl border border-stone-200"
          />
          <textarea
            placeholder="Deskripsi singkat destinasi"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2 px-3 py-2 rounded-xl border border-stone-200"
            rows={2}
          />
          <textarea
            placeholder="Keterangan tambahan / aturan pengunjung"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="px-3 py-2 rounded-xl border border-stone-200"
            rows={2}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium">
            <Plus className="w-3.5 h-3.5" /> {editingId ? 'Simpan Perubahan' : 'Tambah Destinasi'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3.5">Destinasi</th>
              <th className="p-3.5">Kategori & Zona</th>
              <th className="p-3.5">Operasional</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {destinations.map((d) => (
              <tr key={d.id}>
                <td className="p-3.5 font-medium text-stone-900">{d.name}</td>
                <td className="p-3.5 text-stone-600">{d.category} · {d.zone}</td>
                <td className="p-3.5 text-stone-600">{d.openTime} – {d.closeTime}</td>
                <td className="p-3.5 text-right space-x-1">
                  <button onClick={() => handleEdit(d)} className="p-1.5 text-stone-500 hover:text-stone-900">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(d.id)} className="p-1.5 text-stone-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}