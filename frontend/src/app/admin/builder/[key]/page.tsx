import { API_URL } from "@/lib/config";
import HomeBuilderView from "@/components/admin/HomeBuilder/HomeBuilderView";

export const dynamic = "force-dynamic";

async function getProductsData() {
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

interface PageProps {
  params: Promise<{
    key: string;
  }>;
}

export default async function GenericBuilderPage({ params }: PageProps) {
  const { key } = await params;
  const allProducts = await getProductsData();
  
  const title = key.charAt(0).toUpperCase() + key.slice(1);
  const slug = `/${key}`;
  
  return (
    <HomeBuilderView
      pageKey={key}
      pageTitle={title}
      pageSlug={slug}
      allProducts={allProducts}
    />
  );
}
