"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/config";
import {
  Plus, Pencil, Trash2, Shield, ShieldCheck, X, Check, Loader2, Users,
} from "lucide-react";

const ALL_PERMISSIONS = [
  "DASHBOARD", "PRODUCTS", "MEDIA", "CATEGORIES", "BRANDS",
  "SPECIFICATIONS", "VARIATIONS", "ORDERS", "IMPORT", "PAGES",
  "SETTINGS", "USERS",
];

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
  createdAt: string;
}

const emptyForm = { name: "", email: "", password: "", role: "ADMIN" as "ADMIN" | "SUPER_ADMIN", permissions: [] as string[] };

export default function AdminUsersPage() {
  const { user: me, logout } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("freshcart_access_token") : "";

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("freshcart_access_token") || "" : "");

  const handleForceLogout = useCallback(() => {
    logout();
  }, [logout]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin-users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return handleForceLogout();
      const data = await res.json();
      if (data.success) setAdmins(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const togglePermission = (perm: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm],
    }));
  };

  const handleCreate = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch(`${API_URL}/api/admin-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      if (res.status === 401) return handleForceLogout();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create admin");
      setShowCreate(false); setForm(emptyForm); fetchAdmins();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    setSaving(true); setError("");
    try {
      const payload: any = { name: form.name, role: form.role, permissions: form.permissions };
      if (form.password) payload.password = form.password;
      
      const res = await fetch(`${API_URL}/api/admin-users/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) return handleForceLogout();
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update admin");
      setEditTarget(null); setForm(emptyForm); fetchAdmins();
    } catch (e: any) { setError(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin-users/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 401) return handleForceLogout();
      if (res.ok) { setDeleteTarget(null); fetchAdmins(); }
    } finally { setSaving(false); }
  };

  const openEdit = (admin: AdminUser) => {
    setEditTarget(admin);
    setForm({ name: admin.name, email: admin.email, password: "", role: admin.role, permissions: [...admin.permissions] });
    setError("");
  };

  const closeModal = () => {
    setShowCreate(false); setEditTarget(null); setDeleteTarget(null);
    setForm(emptyForm); setError("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage administrator accounts and their permissions.</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setError(""); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} /> Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No admin users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">User</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Role</th>
                <th className="text-left px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-500">Permissions</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm ${admin.role === 'SUPER_ADMIN' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                        {admin.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{admin.name}</p>
                        <p className="text-xs text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {admin.role === 'SUPER_ADMIN' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <ShieldCheck size={12} /> Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        <Shield size={12} /> Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.includes('ALL') || admin.role === 'SUPER_ADMIN' ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">All Access</span>
                      ) : admin.permissions.length === 0 ? (
                        <span className="text-xs text-gray-400">No permissions</span>
                      ) : admin.permissions.map(p => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {admin.id !== me?.id && (
                        <>
                          <button onClick={() => openEdit(admin)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-emerald-500 transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(admin)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(showCreate || editTarget) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black dark:text-white">{editTarget ? "Edit Admin" : "New Admin User"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>

            {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  placeholder="Full name" />
              </div>
              {!editTarget && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                    placeholder="admin@example.com" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Password {editTarget && <span className="font-normal normal-case">(Leave blank to keep current)</span>}
                </label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  placeholder={editTarget ? "New password" : "Strong password"} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as any }))}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white">
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              {form.role === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Module Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_PERMISSIONS.map(perm => (
                      <button key={perm} type="button" onClick={() => togglePermission(perm)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          form.permissions.includes(perm)
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${form.permissions.includes(perm) ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}>
                          {form.permissions.includes(perm) && <Check size={10} className="text-white" />}
                        </div>
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {form.role === 'SUPER_ADMIN' && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 rounded-xl">
                  Super Admin has access to all modules automatically.
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                Cancel
              </button>
              <button onClick={editTarget ? handleUpdate : handleCreate} disabled={saving}
                className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editTarget ? "Save Changes" : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-sm bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black dark:text-white mb-2">Delete Admin</h2>
              <p className="text-gray-500 text-sm mb-6">
                Are you sure you want to remove <strong className="text-gray-900 dark:text-white">{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
