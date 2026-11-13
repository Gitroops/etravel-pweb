import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, BookOpen, X } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { getPopularDestinations } from '../../utils/algorithms';
import { getActivePromo } from '../../utils/formatters';
import DestinationCard from '../../components/common/DestinationCard';



export default function HomePage() {
  const { currentUser, publishedDestinations, promos, articles } = useTravel();
  const [selectedArticle, setSelectedArticle] = useState(null);

  const popularDestinations = getPopularDestinations(publishedDestinations, promos).slice(0, 3);
  const promoDestinations = publishedDestinations.filter((d) => getActivePromo(d.id, promos));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-14">
      {/* Hero & Sapaan Personal */}
      <section className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-3">
          <p className="text-xs uppercase tracking-widest text-emerald-800 font-semibold">
            Yogyakarta Curated Travel
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
            Sugeng Rawuh, {currentUser?.name || 'Wisatawan'}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Rencanakan perjalanan wisata Yogyakarta tanpa jadwal yang saling bertabrakan. Pilih destinasi favoritmu dan biarkan sistem menyusun rute harian yang realistis.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/cari"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
            >
              Jelajahi Destinasi <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/keranjang"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100 transition"
            >
              Atur Jadwal Perjalanan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-72 shrink-0">
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/70">
            <span className="text-2xl font-semibold text-stone-900">{publishedDestinations.length}</span>
            <p className="text-xs text-stone-500 mt-1">Destinasi Terverifikasi</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-stone-200/70">
            <span className="text-2xl font-semibold text-emerald-800">{promoDestinations.length}</span>
            <p className="text-xs text-stone-500 mt-1">Promo Aktif Hari Ini</p>
          </div>
        </div>
      </section>

      {/* Rekomendasi Wisata Populer (Algoritma) */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Berdasarkan tren pemesanan & rating saat ini</span>
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Sedang Populer di Jogja</h2>
          </div>
          <Link to="/cari" className="text-sm text-stone-600 hover:text-stone-900 font-medium">
            Lihat semua →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* Promo Spesial */}
      {promoDestinations.length > 0 && (
        <section className="space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Penawaran terbatas dengan kuota harian</span>
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Promo Wisata Pilihan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {promoDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>
      )}

      {/* Artikel Wisata */}
      <section className="space-y-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Catatan Perjalanan & Panduan Lokal</span>
          </div>
          <h2 className="text-xl font-semibold text-stone-900">Artikel Seputar Jogja</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="cursor-pointer bg-white border border-stone-200/90 rounded-2xl p-4 flex gap-4 hover:border-stone-300 transition"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-28 h-28 rounded-xl object-cover shrink-0 bg-stone-100"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-stone-400">
                    {article.date} · {article.readTime}
                  </span>
                  <h3 className="font-semibold text-stone-900 text-sm mt-1 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{article.excerpt}</p>
                </div>
                <span className="text-xs font-medium text-emerald-800 mt-2">Baca selengkapnya →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Detail Artikel */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs text-stone-400">
                  {selectedArticle.author} · {selectedArticle.date}
                </span>
                <h3 className="text-lg font-semibold text-stone-900 mt-1">{selectedArticle.title}</h3>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="p-1.5 rounded-lg hover:bg-stone-100">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-48 object-cover rounded-xl" />
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">{selectedArticle.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}