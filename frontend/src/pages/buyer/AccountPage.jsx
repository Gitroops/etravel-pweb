import { useState } from 'react';
import { User, Lock, Globe, LogOut, Trash2, Check } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

export default function AccountPage() {
  const { currentUser, setCurrentUser } = useTravel();
  const [profile, setProfile] = useState(currentUser || { name: '', email: '', phone: '', language: 'ID' });
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [message, setMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-semibold text-stone-900">Kamu Telah Keluar dari Akun</h2>
        <button
          onClick={() =>
            setCurrentUser({
              id: 'usr-1',
              name: 'Raka Pratama',
              email: 'raka.pratama@email.com',
              phone: '081234567890',
              language: 'ID',
              status: 'Aktif'
            })
          }
          className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium"
        >
          Masuk Kembali
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setCurrentUser({ ...currentUser, ...profile });
    setMessage('Informasi pribadi & preferensi bahasa berhasil diperbarui.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.next) return;
    setPasswords({ current: '', next: '' });
    setMessage('Password berhasil diperbarui.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Yakin ingin menghapus akun secara permanen? Semua data sesi akan dihapus.')) {
      localStorage.removeItem('etravel_user');
      setCurrentUser(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Pengaturan Akun</h1>
        <p className="text-sm text-stone-500 mt-1">Kelola informasi pribadi, keamanan, dan preferensi aplikasi.</p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> {message}
        </div>
      )}

      {/* Informasi Pribadi & Bahasa */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm text-stone-900">
          <User className="w-4 h-4 text-emerald-800" /> Informasi Pribadi & Bahasa
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-stone-500 block mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 block mb-1">Nomor Telepon</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-stone-500 flex items-center gap-1 mb-1">
              <Globe className="w-3.5 h-3.5" /> Bahasa Aplikasi
            </label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white"
            >
              <option value="ID">Bahasa Indonesia</option>
              <option value="EN">English</option>
            </select>
          </div>
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium">
          Simpan Perubahan
        </button>
      </form>

      {/* Ganti Password */}
      <form onSubmit={handleChangePassword} className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm text-stone-900">
          <Lock className="w-4 h-4 text-emerald-800" /> Ganti Password
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="Password Saat Ini"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
          />
          <input
            type="password"
            placeholder="Password Baru"
            value={passwords.next}
            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-sm"
          />
        </div>
        <button type="submit" className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-medium hover:bg-stone-50">
          Perbarui Password
        </button>
      </form>

      {/* Log Out & Hapus Akun */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setCurrentUser(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-300 text-xs font-medium text-stone-700 hover:bg-stone-100"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>

        <button
          onClick={handleDeleteAccount}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" /> Hapus Akun Permanen
        </button>
      </div>
    </div>
  );
}