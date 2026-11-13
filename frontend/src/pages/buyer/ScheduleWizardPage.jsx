import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowUpDown, Calendar, AlertCircle, AlertTriangle,
  Users, CopyCheck, MapPin, CreditCard, CheckCircle2, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { autoGroupDestinations, validateDaySchedule } from '../../utils/algorithms';
import { formatRupiah, getEffectivePrice } from '../../utils/formatters';

export default function ScheduleWizardPage() {
  const navigate = useNavigate();
  const { cart, publishedDestinations, pricingList, promos, currentUser, createOrder } = useTravel();
  const selectedDestinations = publishedDestinations.filter((d) => cart.includes(d.id));

  const [step, setStep] = useState(1); // 1: Kelompok Hari, 2: Tanggal & Jam, 3: Tiket & Pengunjung, 4: Jemput & Checkout

  // Step 1 State: Array of Array destinasi [[destA, destB], [destC]]
  const [dayGroups, setDayGroups] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);

  // Step 2 State: Tanggal per hari & Jam kunjungan per destinasi
  const [dayDates, setDayDates] = useState({});
  const [visitTimes, setVisitTimes] = useState({});

  // Step 3 State: Jumlah tiket & daftar pengunjung per destinasi
  const [ticketCounts, setTicketCounts] = useState({});
  const [visitors, setVisitors] = useState({});

  // Step 4 State: Penjemputan & Pembayaran
  const [pickup, setPickup] = useState({
    hotelOrPlace: '',
    landmark: '',
    phone: currentUser?.phone || ''
  });
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');

  // Inisialisasi awal: setiap destinasi berdiri sendiri sebelum dikelompokkan
  useEffect(() => {
    if (selectedDestinations.length > 0 && dayGroups.length === 0) {
      setDayGroups(selectedDestinations.map((d) => [d]));
      const initTickets = {};
      const initVisitors = {};
      const initTimes = {};
      selectedDestinations.forEach((d) => {
        initTickets[d.id] = 1;
        initVisitors[d.id] = [{ fullName: currentUser?.name || '', idNumber: '' }];
        initTimes[d.id] = d.openTime;
      });
      setTicketCounts(initTickets);
      setVisitors(initVisitors);
      setVisitTimes(initTimes);
    }
  }, [selectedDestinations.length]);

  if (selectedDestinations.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-stone-600 text-sm">Tidak ada destinasi di keranjang untuk dijadwalkan.</p>
      </div>
    );
  }

  // --- LOGIKA STEP 1: PENGELOMPOKAN ---
  const handleToggleCheck = (destId) => {
    setCheckedIds((prev) => {
      if (prev.includes(destId)) return prev.filter((id) => id !== destId);
      if (prev.length >= 2) return [prev[1], destId]; // Maksimal 2 destinasi
      return [...prev, destId];
    });
  };

  const handleMergeChecked = () => {
    if (checkedIds.length !== 2) return;
    const destA = selectedDestinations.find((d) => d.id === checkedIds[0]);
    const destB = selectedDestinations.find((d) => d.id === checkedIds[1]);

    // Keluarkan kedua destinasi dari kelompok lamanya, lalu gabungkan jadi 1 hari
    const cleaned = dayGroups
      .map((group) => group.filter((d) => !checkedIds.includes(d.id)))
      .filter((group) => group.length > 0);

    setDayGroups([...cleaned, [destA, destB]]);
    setCheckedIds([]);
  };

  const handleSplitGroup = (dayIdx) => {
    const target = dayGroups[dayIdx];
    if (target.length < 2) return;
    const updated = [...dayGroups];
    updated.splice(dayIdx, 1, [target[0]], [target[1]]);
    setDayGroups(updated);
  };

  const handleSwapOrderInDay = (dayIdx) => {
    const updated = [...dayGroups];
    updated[dayIdx] = [updated[dayIdx][1], updated[dayIdx][0]];
    setDayGroups(updated);
  };

  const handleAutoRecommend = () => {
    setDayGroups(autoGroupDestinations(selectedDestinations));
    setCheckedIds([]);
  };

  // --- LOGIKA STEP 2: VALIDASI TANGGAL & JAM ---
  const dayValidations = dayGroups.map((group, idx) =>
    validateDaySchedule(group, dayDates[idx], visitTimes)
  );
  const allSchedulesValid = dayValidations.every((v) => v.isValid);

  // --- LOGIKA STEP 3: JUMLAH TIKET & SALIN DATA PENGUNJUNG ---
  const handleTicketChange = (destId, count) => {
    const validCount = Math.max(1, Math.min(10, Number(count) || 1));
    setTicketCounts((prev) => ({ ...prev, [destId]: validCount }));
    setVisitors((prev) => {
      const currentList = prev[destId] || [];
      if (validCount > currentList.length) {
        const extra = Array.from({ length: validCount - currentList.length }, () => ({
          fullName: '',
          idNumber: ''
        }));
        return { ...prev, [destId]: [...currentList, ...extra] };
      }
      return { ...prev, [destId]: currentList.slice(0, validCount) };
    });
  };

  const handleCopyVisitorsFromPrev = (currentDestId, prevDestId) => {
    const sourceVisitors = visitors[prevDestId] || [];
    const targetCount = ticketCounts[currentDestId] || 1;
    const copied = Array.from({ length: targetCount }, (_, i) => ({
      fullName: sourceVisitors[i]?.fullName || sourceVisitors[0]?.fullName || '',
      idNumber: sourceVisitors[i]?.idNumber || ''
    }));
    setVisitors((prev) => ({ ...prev, [currentDestId]: copied }));
  };

  // --- KALKULASI HARGA CHECKOUT ---
  const orderedFlatDestinations = dayGroups.flatMap((group, dayIdx) =>
    group.map((dest, orderInDay) => {
      const dateStr = dayDates[dayIdx];
      const priceInfo = getEffectivePrice(dest.id, pricingList, promos, dateStr);
      const count = ticketCounts[dest.id] || 1;
      const unitPrice = priceInfo?.finalPrice || 0;
      return {
        destinationId: dest.id,
        destinationName: dest.name,
        dayNumber: dayIdx + 1,
        orderInDay: orderInDay + 1,
        date: dateStr,
        visitTime: visitTimes[dest.id],
        ticketCount: count,
        unitPrice,
        subtotal: unitPrice * count,
        visitors: visitors[dest.id] || [],
        reservationStatus: 'Menunggu Konfirmasi Mitra'
      };
    })
  );

  const ticketsTotal = orderedFlatDestinations.reduce((acc, item) => acc + item.subtotal, 0);
  // Biaya transportasi: Rp 250.000/hari (1 destinasi) atau Rp 350.000/hari (2 destinasi gabungan)
  const transportTotal = dayGroups.reduce((acc, g) => acc + (g.length === 2 ? 350000 : 250000), 0);
  const grandTotal = ticketsTotal + transportTotal;

  const handleConfirmCheckout = () => {
    if (!pickup.hotelOrPlace || !pickup.landmark || !pickup.phone || !agreedTerms) return;
    createOrder({
      items: orderedFlatDestinations,
      pickup,
      paymentMethod,
      ticketsTotal,
      transportTotal,
      grandTotal
    });
    navigate('/pesanan');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-28 space-y-6">
      {/* Progress Stepper Minimalis */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-between text-xs">
        {[
          { num: 1, label: 'Kelompok Hari' },
          { num: 2, label: 'Tanggal & Jam' },
          { num: 3, label: 'Tiket & Pengunjung' },
          { num: 4, label: 'Jemput & Checkout' }
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 ${
              step === s.num ? 'text-emerald-900 font-semibold' : step > s.num ? 'text-stone-700' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                step >= s.num ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ================= STEP 1: KELOMPOK HARI (MAX 2 DESTINASI) ================= */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-900">1. Susun Kelompok Kunjungan Harian</h2>
              <p className="text-xs text-stone-500 mt-1">
                Ceklis 2 destinasi di bawah untuk menggabungkannya dalam 1 hari yang sama, atau gunakan rekomendasi otomatis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {checkedIds.length === 2 && (
                <button
                  onClick={handleMergeChecked}
                  className="px-3.5 py-2 rounded-xl bg-emerald-900 text-white text-xs font-medium"
                >
                  Gabungkan 2 Terpilih
                </button>
              )}
              <button
                onClick={handleAutoRecommend}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-800 hover:bg-stone-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                Rekomendasi Otomatis
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {dayGroups.map((group, dayIdx) => (
              <div key={dayIdx} className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900">
                    Hari ke-{dayIdx + 1} ({group.length}/2 Destinasi)
                  </span>
                  {group.length === 2 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSwapOrderInDay(dayIdx)}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                      >
                        <ArrowUpDown className="w-3 h-3" /> Ubah Urutan
                      </button>
                      <button
                        onClick={() => handleSplitGroup(dayIdx)}
                        className="text-xs px-2.5 py-1 rounded-lg text-stone-500 hover:bg-stone-100"
                      >
                        Pisahkan
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {group.map((dest, idx) => (
                    <label
                      key={dest.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-stone-200/70 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(dest.id)}
                          onChange={() => handleToggleCheck(dest.id)}
                          className="rounded text-emerald-900 focus:ring-emerald-800"
                        />
                        <div>
                          <span className="text-[11px] font-medium text-stone-400">
                            Tujuan #{idx + 1} · {dest.zone}
                          </span>
                          <p className="text-sm font-medium text-stone-900">{dest.name}</p>
                        </div>
                      </div>
                      <span className="text-xs text-stone-500">
                        Buka {dest.openTime}–{dest.closeTime}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium"
            >
              Lanjut Pilih Tanggal & Jam <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: TANGGAL, JAM & VALIDASI JARAK ================= */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-stone-900">2. Tentukan Tanggal & Jam Kunjungan</h2>
            <p className="text-xs text-stone-500 mt-1">
              Sistem otomatis memvalidasi jam operasional destinasi dan estimasi waktu tempuh antar lokasi.
            </p>
          </div>

          {dayGroups.map((group, dayIdx) => {
            const validation = dayValidations[dayIdx];
            return (
              <div key={dayIdx} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <span className="font-semibold text-sm text-stone-900">Hari ke-{dayIdx + 1}</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={dayDates[dayIdx] || ''}
                      onChange={(e) => setDayDates({ ...dayDates, [dayIdx]: e.target.value })}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.map((dest, idx) => (
                    <div key={dest.id} className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200/80 space-y-2">
                      <span className="text-[11px] font-medium text-emerald-900">
                        Destinasi #{idx + 1} · Jam Buka {dest.openTime}–{dest.closeTime}
                      </span>
                      <p className="font-medium text-sm text-stone-900">{dest.name}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <label className="text-xs text-stone-500">Jam Mulai Kunjungan:</label>
                        <input
                          type="time"
                          value={visitTimes[dest.id] || ''}
                          onChange={(e) => setVisitTimes({ ...visitTimes, [dest.id]: e.target.value })}
                          className="px-2.5 py-1 rounded-lg border border-stone-300 text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {group.length === 2 && (
                  <p className="text-xs text-stone-500">
                    Estimasi waktu perjalanan antar destinasi: <strong>±{validation.travelMinutes} menit</strong>.
                  </p>
                )}

                {validation.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{err}</span>
                  </div>
                ))}

                {validation.warnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 text-amber-800 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}
              </div>
            );
          })}

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-sm">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              disabled={!allSchedulesValid}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium disabled:opacity-40"
            >
              Lanjut Jumlah & Data Pengunjung <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: JUMLAH TIKET & DATA PENGUNJUNG ================= */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-stone-900">3. Jumlah Pesanan & Data Diri Pengunjung</h2>
            <p className="text-xs text-stone-500 mt-1">
              Tentukan jumlah tiket dan lengkapi identitas pengunjung untuk registrasi masuk objek wisata.
            </p>
          </div>

          {orderedFlatDestinations.map((item, idx) => {
            const destVisitors = visitors[item.destinationId] || [];
            const prevDest = idx > 0 ? orderedFlatDestinations[idx - 1] : null;

            return (
              <div key={item.destinationId} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs text-emerald-800 font-medium">
                      Hari ke-{item.dayNumber} ({item.date}) · {formatRupiah(item.unitPrice)}/tiket
                    </span>
                    <h3 className="font-semibold text-stone-900">{item.destinationName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-stone-400" />
                    <span className="text-xs text-stone-600">Jumlah Tiket:</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.ticketCount}
                      onChange={(e) => handleTicketChange(item.destinationId, e.target.value)}
                      className="w-16 px-2.5 py-1 rounded-lg border border-stone-300 text-xs text-center"
                    />
                  </div>
                </div>

                {prevDest && (
                  <label className="inline-flex items-center gap-2 text-xs text-emerald-900 font-medium cursor-pointer bg-emerald-50/70 px-3 py-2 rounded-lg">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) handleCopyVisitorsFromPrev(item.destinationId, prevDest.destinationId);
                      }}
                    />
                    <CopyCheck className="w-3.5 h-3.5" />
                    Samakan data diri pengunjung dari {prevDest.destinationName}
                  </label>
                )}

                <div className="space-y-2.5">
                  {destVisitors.map((vis, vIdx) => (
                    <div key={vIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder={`Nama Lengkap Pengunjung #${vIdx + 1}`}
                        value={vis.fullName}
                        onChange={(e) => {
                          const updated = [...destVisitors];
                          updated[vIdx] = { ...updated[vIdx], fullName: e.target.value };
                          setVisitors({ ...visitors, [item.destinationId]: updated });
                        }}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="NIK / Nomor Identitas (Opsional untuk anak)"
                        value={vis.idNumber}
                        onChange={(e) => {
                          const updated = [...destVisitors];
                          updated[vIdx] = { ...updated[vIdx], idNumber: e.target.value };
                          setVisitors({ ...visitors, [item.destinationId]: updated });
                        }}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-sm">
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium"
            >
              Lanjut Titik Jemput & Checkout <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: PENJEMPUTAN & CHECKOUT ================= */}
      {step === 4 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-semibold text-stone-900">Titik Penjemputan Wisatawan</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Nama Hotel / Stasiun / Alamat Lengkap *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Hotel Tentrem Yogyakarta / Stasiun Tugu Pintu Selatan"
                    value={pickup.hotelOrPlace}
                    onChange={(e) => setPickup({ ...pickup, hotelOrPlace: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Patokan Lokasi *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lobi utama dekat resepsionis / Sebrang minimarket"
                    value={pickup.landmark}
                    onChange={(e) => setPickup({ ...pickup, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-600 block mb-1">Nomor Telepon / WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={pickup.phone}
                    onChange={(e) => setPickup({ ...pickup, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800" />
                <h2 className="text-base font-semibold text-stone-900">Metode Pembayaran</h2>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {['QRIS', 'Virtual Account BCA', 'Transfer Mandiri'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                      paymentMethod === method
                        ? 'border-emerald-800 bg-emerald-50/60 text-emerald-950'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ringkasan Checkout */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 sticky top-24">
              <h3 className="font-semibold text-stone-900">Ringkasan & Rincian Biaya</h3>

              <div className="space-y-2.5 text-xs border-b border-stone-100 pb-3">
                {orderedFlatDestinations.map((item) => (
                  <div key={item.destinationId} className="flex justify-between gap-2">
                    <span className="text-stone-600">
                      H{item.dayNumber} · {item.destinationName} ({item.ticketCount}x)
                    </span>
                    <span className="font-medium text-stone-900">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-2 pt-1 text-stone-600">
                  <span>Transportasi & Driver ({dayGroups.length} Hari)</span>
                  <span className="font-medium text-stone-900">{formatRupiah(transportTotal)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-stone-700">Total Pembayaran</span>
                <span className="text-lg font-bold text-emerald-900">{formatRupiah(grandTotal)}</span>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F6] text-[11px] text-stone-600 space-y-1.5">
                <p className="font-semibold text-stone-800">Syarat & Ketentuan Mitra:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Driver standby 15 menit sebelum jam penjemputan pertama.</li>
                  <li>Tiket masuk yang sudah diterbitkan tidak dapat di-refund H-1.</li>
                </ul>
              </div>

              <label className="flex items-start gap-2 text-xs text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-900"
                />
                <span>Saya menyetujui jadwal kunjungan dan syarat ketentuan mitra JogjaRute.</span>
              </label>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setStep(3)}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  Kembali
                </button>
                <button
                  disabled={!pickup.hotelOrPlace || !pickup.landmark || !pickup.phone || !agreedTerms}
                  onClick={handleConfirmCheckout}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" /> Bayar & Terbitkan Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}