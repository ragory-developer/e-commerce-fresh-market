"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Image as ImageIcon, LayoutGrid, PackageOpen } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  specialPrice: number | null;
  specialPriceStart: string | null;
  specialPriceEnd: string | null;
  stock: number;
  featured: boolean;
  productType: "SIMPLE" | "VARIABLE";
  categories: { id: string; name: string }[];
  priceRange?: { min: number; max: number } | null;
}

const API = `${API_URL}/api/products`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
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

  const fetchProducts = useCallback(async () => {
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
        setProducts(json.data || []);
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
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete product");
      }
    } catch (e) {
      alert("Network error");
    }
  };

  const formatPrice = (p: Product) => {
    if (p.productType === "VARIABLE" && p.priceRange) {
      if (p.priceRange.min === p.priceRange.max) return `$${p.priceRange.min.toFixed(2)}`;
      return `$${p.priceRange.min.toFixed(2)} - $${p.priceRange.max.toFixed(2)}`;
    }
    
    const isOnSale = p.specialPrice && p.specialPrice < p.price;
    if (isOnSale) {
      return (
        <div className="flex flex-col">
          <span className="text-blue-600 dark:text-blue-400 font-bold">${p.specialPrice?.toFixed(2)}</span>
          <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
        </div>
      );
    }
    
    return `$${p.price.toFixed(2)}`;
  };

  const getSaleDates = (p: Product) => {
    if (!p.specialPriceStart && !p.specialPriceEnd) return "Active Sale";
    const start = p.specialPriceStart ? new Date(p.specialPriceStart).toLocaleDateString() : 'Now';
    const end = p.specialPriceEnd ? new Date(p.specialPriceEnd).toLocaleDateString() : 'Always';
    return `Sale: ${start} - ${end}`;
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all products in your store</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products by name..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Show:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-all shadow-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              {totalItems} total products
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700">
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Product</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[35%]">Name & Categories</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Price</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[10%]">Stock</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[15%]">Features</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500 bg-gray-50/30 dark:bg-gray-800/30">
                    <PackageOpen size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-semibold text-gray-700 dark:text-gray-300">No products found</p>
                    <p className="text-xs mt-1">Try adjusting your search or add a new product.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-750 transition-colors group">
                    {/* Image */}
                    <td className="px-5 py-3">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    
                    {/* Name & Categories */}
                    <td className="px-5 py-3">
                      <Link 
                        href={settings.permalink_structure === 'product' ? `/product/${product.slug}` : `/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 line-clamp-1 transition-colors hover:underline" 
                        title={`View ${product.name} on live site`}
                      >
                        {product.name}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {product.categories.length > 0 ? (
                          product.categories.map(c => (
                            <span key={c.id} className="inline-flex text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold px-1.5 py-0.5 rounded">
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-red-500 dark:text-red-400">Uncategorized</span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3">
                      <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                        {formatPrice(product)}
                      </p>
                      {product.productType === "VARIABLE" && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                          <LayoutGrid size={10} /> Variable
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3">
                      {product.productType === "VARIABLE" ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
                      ) : (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                          product.stock > 10 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" :
                          product.stock > 0 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" :
                          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </span>
                      )}
                    </td>

                    {/* Features/Status */}
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1.5">
                        {product.featured && (
                          <span className="inline-flex w-fit items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                            ★ Featured
                          </span>
                        )}
                        {product.specialPrice && product.specialPrice < product.price && (
                          <span 
                            className="inline-flex w-fit items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50 cursor-help"
                            title={getSaleDates(product)}
                          >
                            % Sale
                          </span>
                        )}
                        {!product.featured && (!product.specialPrice || product.specialPrice >= product.price) && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/edit/${product.slug}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                          title="Edit Product"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                          title="Delete Product"
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium order-2 sm:order-1">
              Showing page <span className="font-bold text-gray-900 dark:text-white">{page}</span> of <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
            </span>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1 mx-1">
                {/* Modern Pagination Logic */}
                {(() => {
                  const pages = [];
                  const delta = 2; // Number of pages either side of current page
                  const left = page - delta;
                  const right = page + delta + 1;
                  const range = [];
                  const rangeWithDots = [];
                  let l;

                  for (let i = 1; i <= totalPages; i++) {
                    if (i === 1 || i === totalPages || (i >= left && i < right)) {
                      range.push(i);
                    }
                  }

                  for (let i of range) {
                    if (l) {
                      if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                      } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                      }
                    }
                    rangeWithDots.push(i);
                    l = i;
                  }

                  return rangeWithDots.map((p, index) => (
                    <button
                      key={index}
                      onClick={() => typeof p === 'number' && setPage(p)}
                      disabled={p === '...'}
                      className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                        p === page 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                          : p === '...'
                          ? "text-gray-400 cursor-default"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  ));
                })()}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
