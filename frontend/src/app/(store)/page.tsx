import { API_URL } from "@/lib/config";
import HomeView from "@/components/home/HomeView";

export const dynamic = "force-dynamic";

async function getHomePageData() {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100&featured=true`, {
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
async function getHomePageConfig() {
  try {
    const res = await fetch(`${API_URL}/api/builder/public/home`, {
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.version?.document || null;
  } catch (error) {
    console.error("Failed to fetch home page config:", error);
    return null;
  }
}

export default async function Home() {
  const [allProducts, config] = await Promise.all([
    getHomePageData(),
    getHomePageConfig()
  ]);
  
  return <HomeView allProducts={allProducts} document={config} />;
}
