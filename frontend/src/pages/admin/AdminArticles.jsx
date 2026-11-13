import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function AdminArticles() {
  const { articles, setArticles } = useTravel();
  const [form, setForm] = useState({ title: '', author: 'Admin JogjaRute', excerpt: '', content: '', image: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setArticles((prev) => [
      {
        ...form,
        id: `art-${Date.now()}`,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: '3 mnt baca',
        image: form.image || 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80'
      },
      ...prev
    ]);
    setForm({ title: '', author: 'Admin JogjaRute', excerpt: '', content: '', image: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Artikel Wisata Jogja</h1>
        <p className="text-xs text-stone-500">Publikasikan tips perjalanan dan cerita budaya di Beranda Pembeli.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3 text-xs">
        <input
          required
          placeholder="Judul Artikel"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-stone-200"
        />
        <input
          placeholder="Ringkasan Singkat (Excerpt)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-stone-200"
        />
        <textarea
          required
          rows={4}
          placeholder="Isi Lengkap Artikel..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-3 py-2 rounded-xl border border-stone-200"
        />
        <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white font-medium">
          <Plus className="w-3.5 h-3.5" /> Terbitkan Artikel
        </button>
      </form>

      <div className="space-y-2.5">
        {articles.map((art) => (
          <div key={art.id} className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-stone-900">{art.title}</h3>
              <p className="text-xs text-stone-500">{art.date} · {art.author}</p>
            </div>
            <button
              onClick={() => setArticles((prev) => prev.filter((a) => a.id !== art.id))}
              className="p-2 text-stone-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}