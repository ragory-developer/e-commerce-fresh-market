"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, FileCode2, LayoutGrid, MonitorPlay } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

interface Page {
  id: string;
  title: string;
  slug: string;
  status: string;
  createdAt: string;
}

const API = `${API_URL}/api/pages`;

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { settings } = useSettingsStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await fetch(`${API}?${params}`);
      const json = await res.json();
      if (json.success) {
        setPages(json.data || []);
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages);
          setTotalItems(json.pagination.total);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the page "${title}"?`)) return;
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const res = await fetch(`${API}/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchPages();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete page");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Pages</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage custom landing pages and content using the Drag & Drop Builder</p>
        </div>
        <Link
          href="/admin/pages/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Add New Page
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search pages by title..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[40%]">Title & Slug</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[20%]">Created At</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading && pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">Loading pages...</td>
                </tr>
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/30">
                    <FileCode2 size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">No pages found</p>
                    <p className="text-xs mt-1">Start by creating a new custom page.</p>
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">
                        {page.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        /{page.slug}
                      </div>
                    </td>
                    
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                        page.status === 'published' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      }`}>
                        {page.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-colors flex items-center gap-1"
                          title="View Live Page"
                        >
                          <MonitorPlay size={16} />
                        </Link>
                        <Link
                          href={`/admin/pages/edit/${page.slug}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 dark:hover:text-purple-400 transition-colors"
                          title="Edit Page"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(page.id, page.title)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
