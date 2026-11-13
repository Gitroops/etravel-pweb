const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function getDayNameFromDate(dateString) {
  if (!dateString) return 'Senin';
  const date = new Date(dateString + 'T00:00:00');
  return DAYS_ID[date.getDay()];
}

export function getActivePromo(destinationId, promos) {
  const today = new Date().toISOString().split('T')[0];
  return promos.find(
    (p) =>
      p.destinationId === destinationId &&
      p.isPublished &&
      p.startDate <= today &&
      p.endDate >= today &&
      p.usedQuota < p.quota
  ) || null;
}

export function getEffectivePrice(destinationId, pricingList, promos, dateString = null) {
  const pricing = pricingList.find((p) => p.destinationId === destinationId && p.isPublished);
  if (!pricing) return null;

  const dayName = dateString ? getDayNameFromDate(dateString) : DAYS_ID[new Date().getDay()];
  const basePrice = pricing.samePriceAllDays
    ? pricing.dailyPrices.Senin
    : (pricing.dailyPrices[dayName] || pricing.dailyPrices.Senin);

  const activePromo = getActivePromo(destinationId, promos);
  if (activePromo) {
    const finalPrice = Math.round(basePrice * (1 - activePromo.discountPercent / 100));
    return {
      basePrice,
      finalPrice,
      hasPromo: true,
      promo: activePromo,
      quotaPerDay: pricing.quotaPerDay
    };
  }

  return {
    basePrice,
    finalPrice: basePrice,
    hasPromo: false,
    promo: null,
    quotaPerDay: pricing.quotaPerDay
  };
}