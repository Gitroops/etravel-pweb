import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useTravel();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = loginUser(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }
    navigate(result.role === 'admin' ? '/admin/destinasi' : '/');
  };

  const fillDemoAccount = (type) => {
    setError('');
    if (type === 'admin') {
      setEmail('admin@jogjarute.id');
      setPassword('admin123');
    } else {
      setEmail('raka.pratama@email.com');
      setPassword('password123');
    }
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
          <h1 className="text-2xl font-semibold text-stone-900 pt-2">Selamat Datang Kembali</h1>
          <p className="text-xs text-stone-500">
            Masuk untuk melanjutkan rencana perjalanan atau mengelola destinasi wisata.
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-emerald-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
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

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition"
            >
              Masuk ke Akun <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Akun Demo Cepat */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <p className="text-[11px] text-stone-400 text-center">Isi cepat akun uji coba:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('buyer')}
                className="py-1.5 px-3 rounded-lg bg-[#FAF9F6] border border-stone-200 text-[11px] font-medium text-stone-700 hover:bg-stone-100"
              >
                Demo Pembeli
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="py-1.5 px-3 rounded-lg bg-[#FAF9F6] border border-stone-200 text-[11px] font-medium text-emerald-900 hover:bg-stone-100"
              >
                Demo Admin
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-stone-600">
          Belum punya akun JogjaRute?{' '}
          <Link to="/daftar" className="font-semibold text-emerald-900 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}