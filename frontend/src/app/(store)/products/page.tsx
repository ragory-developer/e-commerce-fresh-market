import { API_URL } from "@/lib/config";
import InfiniteProductList from "@/components/product/InfiniteProductList";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductFilters from "@/components/product/ProductFilters";
import { Suspense } from "react";

async function getProducts(searchParams: any) {
  try {
    const query = new URLSearchParams();
    if (searchParams.category) query.set("category", searchParams.category);
    if (searchParams.minPrice) query.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) query.set("maxPrice", searchParams.maxPrice);
    if (searchParams.attributes) query.set("attributes", searchParams.attributes);
    if (searchParams.search) query.set("search", searchParams.search);
    query.set("limit", "20");

    const res = await fetch(`${API_URL}/api/products?${query.toString()}`, {
      cache: 'no-store'
    });
    if (!res.ok) return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
    const json = await res.json();
    return { 
      data: json.data || [], 
      pagination: json.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 } 
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
  }
}

async function getGlobalSettings() {
  try {
    const res = await fetch(`${API_URL}/api/global-settings`, {
      cache: 'no-store'
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    return {};
  }
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | undefined }> 
}) {
  const params = await searchParams;
  const { data: products, pagination } = await getProducts(params);
  const settings = await getGlobalSettings();

  const perRow = parseInt(settings.products_per_row || "3");
  const isInfinite = settings.enable_infinite_scroll === "true";
  
  // Map perRow to Tailwind grid classes
  const gridCols = {
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
    5: "xl:grid-cols-5",
    6: "xl:grid-cols-6",
  }[perRow as 2|3|4|5|6] || "xl:grid-cols-3";

  // Construct base fetch URL for infinite scroll
  const fetchUrl = new URL(`${API_URL}/api/products`);
  if (params.category) fetchUrl.searchParams.set("category", params.category);
  if (params.minPrice) fetchUrl.searchParams.set("minPrice", params.minPrice);
  if (params.maxPrice) fetchUrl.searchParams.set("maxPrice", params.maxPrice);
  if (params.attributes) fetchUrl.searchParams.set("attributes", params.attributes);
  if (params.search) fetchUrl.searchParams.set("search", params.search);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-12">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-4 uppercase tracking-widest">
              <ArrowLeft size={16} className="mr-1" /> Back to Home
            </Link>
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Fresh Market
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-xl">
              Discover our curated selection of premium organic products, sourced directly from sustainable farms for your healthy lifestyle.
            </p>
          </div>
        </div>
 
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block sticky top-8 h-fit">
            <Suspense fallback={<div className="w-72 h-screen animate-pulse bg-gray-100 dark:bg-gray-800 rounded-3xl" />}>
              <ProductFilters />
            </Suspense>
          </aside>
 
          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-lg">
                  {pagination.total} Products
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Sort by:</span>
                <select className="bg-transparent font-bold text-gray-900 dark:text-white border-none outline-none cursor-pointer text-sm">
                  <option>Featured First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Latest Arrivals</option>
                </select>
              </div>
            </div>
 
            {/* Infinite Product List Wrapper */}
            <InfiniteProductList
              initialProducts={products}
              initialPagination={pagination}
              fetchUrl={fetchUrl.toString()}
              gridCols={gridCols}
              enabled={isInfinite}
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}
