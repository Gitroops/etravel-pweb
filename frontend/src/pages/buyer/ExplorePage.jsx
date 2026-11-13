import { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { getActivePromo } from '../../utils/formatters';
import DestinationCard from '../../components/common/DestinationCard';

const CATEGORIES = ['Semua', 'Candi', 'Museum', 'Budaya', 'Alam', 'Promo'];

export default function ExplorePage() {
  const { publishedDestinations, promos } = useTravel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' (A-Z) | 'desc' (Z-A)

  const filteredDestinations = publishedDestinations
    .filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === 'Semua') return true;
      if (selectedCategory === 'Promo') return Boolean(getActivePromo(dest.id, promos));
      return dest.category === selectedCategory;
    })
    .sort((a, b) =>
      sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Eksplorasi Wisata Yogyakarta</h1>
        <p className="text-sm text-stone-500 mt-1">
          Temukan destinasi sejarah, alam, hingga penawaran promo yang sedang berlangsung.
        </p>
      </div>

      {/* Bar Pencarian & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama candi, museum, atau wilayah di Jogja..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
          />
        </div>

        <button
          onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          <ArrowUpDown className="w-4 h-4 text-stone-500" />
          Urutkan Huruf: {sortOrder === 'asc' ? 'A – Z' : 'Z – A'}
        </button>
      </div>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                active
                  ? 'bg-emerald-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Hasil Pencarian */}
      {filteredDestinations.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <p className="text-sm text-stone-500">Tidak ada destinasi yang sesuai dengan filter saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
}