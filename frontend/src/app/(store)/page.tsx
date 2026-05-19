import { API_URL } from "@/lib/config";
import HomeView from "@/components/home/HomeView";
import { getBuilderPublicPage, getBuilderComponents } from "@/page-builder/api";

export const dynamic = "force-dynamic";

async function getHomePageData() {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}


export default async function Home() {
  const [allProducts, config, dbComponents] = await Promise.all([
    getHomePageData(),
    getBuilderPublicPage("home"),
    getBuilderComponents()
  ]);
  
  return <HomeView allProducts={allProducts} document={config} dbComponents={dbComponents} />;
}
