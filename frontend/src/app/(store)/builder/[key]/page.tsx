import { API_URL } from "@/lib/config";
import { getBuilderPublicPage, getBuilderComponents } from "@/page-builder/api";
import BuilderPageRenderer from "@/page-builder/BuilderPageRenderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getProductsData() {
  try {
    const res = await fetch(`${API_URL}/api/products?limit=100`, {
      next: { revalidate: 60 }
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

export default async function GenericBuilderPublicPage({ params }: PageProps) {
  const { key } = await params;
  const [allProducts, document, dbComponents] = await Promise.all([
    getProductsData(),
    getBuilderPublicPage(key),
    getBuilderComponents(),
  ]);

  if (!document) {
    notFound();
  }

  return (
    <BuilderPageRenderer document={document} context={{ allProducts, dbComponents }} />
  );
}
