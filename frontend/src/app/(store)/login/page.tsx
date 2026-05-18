import { Suspense } from "react";
import Link from "next/link";
import LoginTabs from "@/components/auth/LoginTabs";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Sign In — FreshCart",
  description: "Sign in to your FreshCart account with your mobile number and password.",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[80vh] px-4 py-16">
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] shadow-2xl p-8 sm:p-10 max-w-md w-full relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Sign in with your mobile number &amp; password
            </p>
          </div>

          <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" size={28} /></div>}>
            <LoginTabs />
          </Suspense>

          <div className="border-t border-gray-100 dark:border-gray-800 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-black hover:underline">
                Create One
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
