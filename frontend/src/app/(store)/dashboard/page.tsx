"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/lib/config";
import UserSidebar from "@/components/dashboard/UserSidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UserGroupBadges from "@/components/dashboard/UserGroupBadges";
import { Loader2, AlertCircle } from "lucide-react";

interface DashboardData {
  orderCount: number;
  wishlistCount: number;
  rewardPoints: number;
  userGroup: string;
  groups: Array<{ name: string; threshold: number; icon: string; color: string }>;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem("freshcart_access_token") || localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/user-stats-service/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || (loading && !error)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full" />
        </div>
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 p-8 rounded-[2.5rem] text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Oops! Something went wrong</h2>
          <p className="text-red-600 dark:text-red-400 font-medium mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#f8fafc] dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <UserSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
                Monitoring your activity and progress
              </p>
            </div>

            {data && (
              <>
                <DashboardStats 
                  rewardPoints={data.rewardPoints}
                  wishlistCount={data.wishlistCount}
                  orderCount={data.orderCount}
                />
                
                <UserGroupBadges 
                  currentGroup={data.userGroup}
                  purchaseCount={data.orderCount}
                  groups={data.groups}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
