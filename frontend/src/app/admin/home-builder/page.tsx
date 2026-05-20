import { API_URL } from "@/lib/config";
import HomeBuilderView from "@/components/admin/HomeBuilder/HomeBuilderView";

export const dynamic = "force-dynamic";

async function getHomePageData() {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function HomeBuilderPage() {
  const allProducts = await getHomePageData();
  return (
    <HomeBuilderView
      pageKey="home"
      pageTitle="Home"
      pageSlug="/"
      allProducts={allProducts}
    />
  );
}
