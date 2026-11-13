import { useTravel } from '../../context/TravelContext';

export default function AdminUsers() {
  const { usersList, setUsersList } = useTravel();

  const toggleUserStatus = (id) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Manajemen Pengguna</h1>
        <p className="text-xs text-stone-500">Daftar akun wisatawan terdaftar dan kontrol akses akun.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500">
            <tr>
              <th className="p-3.5">Nama Pengguna</th>
              <th className="p-3.5">Email & Telepon</th>
              <th className="p-3.5">Status Akun</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {usersList.map((u) => (
              <tr key={u.id}>
                <td className="p-3.5 font-medium text-stone-900">{u.name}</td>
                <td className="p-3.5 text-stone-600">{u.email} · {u.phone}</td>
                <td className="p-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                    u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className="px-3 py-1 rounded-lg border border-stone-200 hover:bg-stone-50"
                  >
                    Ubah Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}