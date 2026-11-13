import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser } = useTravel();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password minimal terdiri dari 6 karakter.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    const result = registerUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-semibold">
              J.
            </div>
            <span className="font-semibold tracking-tight text-stone-900 text-xl">
              Jogja<span className="text-emerald-800">Rute</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-stone-900 pt-2">Buat Akun Baru</h1>
          <p className="text-xs text-stone-500">
            Mulai susun jadwal kunjungan wisata Yogyakarta secara terstruktur.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap sesuai identitas"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Nomor Telepon / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Ulangi password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-900 text-white text-sm font-medium hover:bg-emerald-800 transition mt-2"
            >
              Daftar Akun <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-600">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-semibold text-stone-900 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}