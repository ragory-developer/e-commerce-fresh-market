"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import GlobalWalletNotice from "@/components/admin/GlobalWalletNotice";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const isBuilderPage = pathname === '/admin/home-builder' || pathname.startsWith('/admin/builder/');

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN'))) {
      router.replace('/admin/login');
    }
  }, [user, loading, router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Allow login page to render even if not authenticated
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <GlobalWalletNotice />
      <AdminSidebar />
      <div className="ml-[260px] min-h-screen transition-all duration-300">
        <main className={isBuilderPage ? "p-0" : "p-6 lg:p-8"}>{children}</main>
      </div>
    </div>
  );
}
