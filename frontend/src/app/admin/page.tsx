"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import { ShoppingBag, FolderTree, Tag, Package } from "lucide-react";

interface DashboardStats {
  products: number;
  categories: number;
  brands: number;
  orders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    brands: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token =
          localStorage.getItem("freshcart_access_token") ||
          localStorage.getItem("token") ||
          "";

        const [productsRes, categoriesRes, brandsRes, ordersRes] =
          await Promise.all([
            fetch(`${API_URL}/api/products?limit=1`),
            fetch(`${API_URL}/api/categories`),
            fetch(`${API_URL}/api/brands?limit=1`),
            fetch(`${API_URL}/api/orders?limit=1`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        const ordersData = await ordersRes.json();

        setStats({
          products: productsData.pagination?.total || 0,
          categories: categoriesData.data?.length || 0,
          brands: brandsData.pagination?.total || 0,
          orders: ordersData.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Products"
          value={loading ? "..." : stats.products}
          icon={<ShoppingBag size={24} />}
          color="emerald"
        />
        <StatsCard
          label="Categories"
          value={loading ? "..." : stats.categories}
          icon={<FolderTree size={24} />}
          color="blue"
        />
        <StatsCard
          label="Brands"
          value={loading ? "..." : stats.brands}
          icon={<Tag size={24} />}
          color="purple"
        />
        <StatsCard
          label="Orders"
          value={loading ? "..." : stats.orders}
          icon={<Package size={24} />}
          color="amber"
        />
      </div>
    </div>
  );
}
