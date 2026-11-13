import { Clock, MapPin, Plus, Check, Tag } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { formatRupiah, getEffectivePrice } from '../../utils/formatters';

export default function DestinationCard({ destination }) {
  const { pricingList, promos, cart, toggleCart } = useTravel();
  const priceInfo = getEffectivePrice(destination.id, pricingList, promos);
  const inCart = cart.includes(destination.id);

  if (!priceInfo) return null;

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between transition hover:border-stone-300">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-xs font-medium text-stone-800">
              {destination.category}
            </span>
            {priceInfo.hasPromo && (
              <span className="px-2.5 py-1 rounded-md bg-amber-600 text-white text-xs font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" /> -{priceInfo.promo.discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>{destination.location}</span>
          </div>
          <h3 className="font-semibold text-stone-900 text-base leading-snug mb-1.5">
            {destination.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {destination.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Buka {destination.openTime} – {destination.closeTime} WIB</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3.5 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
        <div>
          <span className="text-[11px] text-stone-400 block">Tiket hari ini</span>
          {priceInfo.hasPromo ? (
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-emerald-900 text-sm">
                {formatRupiah(priceInfo.finalPrice)}
              </span>
              <span className="text-xs text-stone-400 line-through">
                {formatRupiah(priceInfo.basePrice)}
              </span>
            </div>
          ) : (
            <span className="font-semibold text-stone-900 text-sm">
              {formatRupiah(priceInfo.finalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => toggleCart(destination.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition ${
            inCart
              ? 'bg-emerald-900 text-white'
              : 'bg-stone-900 text-white hover:bg-stone-800'
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-3.5 h-3.5" /> Tersimpan
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Pilih
            </>
          )}
        </button>
      </div>
    </article>
  );
}