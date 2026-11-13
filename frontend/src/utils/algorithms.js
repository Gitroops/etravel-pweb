import { ZONE_TRAVEL_MINUTES } from '../data/initialData';

// 1. Algoritma Wisata Populer (Weighted Popularity Score)
export function getPopularDestinations(publishedDestinations, promos) {
  const today = new Date().toISOString().split('T')[0];

  return [...publishedDestinations]
    .map((dest) => {
      const hasActivePromo = promos.some(
        (p) => p.destinationId === dest.id && p.isPublished && p.startDate <= today && p.endDate >= today && p.usedQuota < p.quota
      );
      // Bobot: Bookings (50%), Rating (30%), Views (15%), Active Promo Boost (5%)
      const popularityScore =
        dest.bookingsCount * 0.5 +
        dest.rating * 40 +
        dest.views * 0.05 +
        (hasActivePromo ? 35 : 0);

      return { ...dest, popularityScore };
    })
    .sort((a, b) => b.popularityScore - a.popularityScore);
}

// Konversi "HH:MM" ke menit sejak 00:00
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getTravelMinutes(zoneA, zoneB) {
  if (!zoneA || !zoneB) return 45;
  return ZONE_TRAVEL_MINUTES[`${zoneA}-${zoneB}`] || 50;
}

// 2. Rekomendasi Pengelompokan Otomatis (Max 2 Destinasi per Hari berdasarkan Zona & Durasi)
export function autoGroupDestinations(selectedDestinations) {
  const remaining = [...selectedDestinations];
  const groups = [];

  while (remaining.length > 0) {
    const first = remaining.shift();
    // Cari pasangan terbaik: zona sama/berdekatan & total waktu tempuh <= 65 menit
    let bestPartnerIdx = -1;
    let lowestTravel = Infinity;

    remaining.forEach((candidate, idx) => {
      const travel = getTravelMinutes(first.zone, candidate.zone);
      if (travel <= 75 && travel < lowestTravel) {
        lowestTravel = travel;
        bestPartnerIdx = idx;
      }
    });

    if (bestPartnerIdx !== -1) {
      const partner = remaining.splice(bestPartnerIdx, 1)[0];
      // Urutkan berdasarkan jam buka paling pagi
      const pair = [first, partner].sort((a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime));
      groups.push(pair);
    } else {
      groups.push([first]);
    }
  }

  return groups;
}

// 3. Validasi Lengkap Jadwal Satu Hari
export function validateDaySchedule(dayGroup, dateStr, visitTimes) {
  const errors = [];
  const warnings = [];
  const today = new Date().toISOString().split('T')[0];

  if (!dateStr) {
    errors.push('Tanggal kunjungan wajib dipilih.');
    return { isValid: false, errors, warnings, travelMinutes: 0 };
  }

  if (dateStr < today) {
    errors.push('Tanggal tidak valid: tidak dapat memilih tanggal di masa lalu.');
  }

  let travelMinutes = 0;

  dayGroup.forEach((dest, index) => {
    const startTime = visitTimes[dest.id];
    if (!startTime) {
      errors.push(`Jam kunjungan untuk ${dest.name} belum ditentukan.`);
      return;
    }

    const startMin = timeToMinutes(startTime);
    const openMin = timeToMinutes(dest.openTime);
    const closeMin = timeToMinutes(dest.closeTime);
    const endMin = startMin + (dest.avgDurationMinutes || 90);

    if (startMin < openMin) {
      errors.push(`${dest.name} baru buka pukul ${dest.openTime} WIB.`);
    }
    if (endMin > closeMin) {
      errors.push(
        `Estimasi selesai di ${dest.name} (${minutesToTime(endMin)}) melewati jam tutup (${dest.closeTime} WIB).`
      );
    }

    // Validasi antar destinasi ke-1 dan ke-2 di hari yang sama
    if (index === 1) {
      const prevDest = dayGroup[0];
      const prevStart = timeToMinutes(visitTimes[prevDest.id]);
      const prevEnd = prevStart + (prevDest.avgDurationMinutes || 90);
      travelMinutes = getTravelMinutes(prevDest.zone, dest.zone);
      const earliestArrival = prevEnd + travelMinutes;

      if (startMin < prevEnd) {
        errors.push(`Jadwal bertabrakan! Kunjungan di ${prevDest.name} baru selesai sekitar ${minutesToTime(prevEnd)}.`);
      } else if (startMin < earliestArrival) {
        errors.push(
          `Waktu transit tidak cukup. Perjalanan dari ${prevDest.name} ke ${dest.name} butuh ±${travelMinutes} menit (tiba pukul ${minutesToTime(earliestArrival)}).`
        );
      } else if (startMin - earliestArrival < 20) {
        warnings.push(`Jeda waktu sangat ketat (${startMin - earliestArrival} menit setelah tiba). Pertimbangkan mundurkan jam kunjungan ke-2.`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    travelMinutes
  };
}