import { API_URL } from "@/lib/config";
import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import AddToCartButton from "@/components/ui/AddToCartButton";
import ProductTabs from "@/components/product/ProductTabs";
import ProductOverview from "@/components/product/ProductOverview";
import ProductCard from "@/components/ui/ProductCard";
import ProductSchema from "@/components/product/ProductSchema";
import ProductViewTracker from "@/components/product/ProductViewTracker";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!product) return { title: "Product Not Found | FreshCart" };

  const { name, shortDescription, description, seoData, image, categories, price, specialPrice } = product;
  const seo = seoData as any;
  const absoluteImageUrl = image ? (image.startsWith('http') ? image : `${API_URL}${image}`) : "";
  const settings = await getGlobalSettings();
  const productUrl = settings.permalink_structure === 'product' ? `${baseUrl}/product/${slug}` : `${baseUrl}/${slug}`;

  const cleanDescription = (seo?.description || shortDescription || description || `Buy ${name} online at FreshCart. Best quality guaranteed.`)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  const metaTitle = seo?.title || name;
  const keywords = seo?.keywords || (categories?.[0]?.name ? `${name}, ${categories[0].name}, FreshCart` : `${name}, FreshCart`);

  return {
    title: `FreshCart | ${metaTitle}`,
    description: cleanDescription,
    keywords: keywords,
    alternates: { canonical: productUrl },
    openGraph: {
      title: metaTitle,
      description: cleanDescription,
      url: productUrl,
      siteName: "FreshCart",
      images: absoluteImageUrl ? [{ url: absoluteImageUrl, width: 800, height: 800, alt: name }] : [],
      type: "website",
    },
    other: {
      "og:type": "og:product",
      "product:price:amount": (specialPrice || price || 0).toString(),
      "product:price:currency": "BDT",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: cleanDescription,
      images: absoluteImageUrl ? [absoluteImageUrl] : [],
    },
  };
}


export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/products/slugs`);
    const json = await res.json();
    return (json.data || []).map((slug: string) => ({ slug }));
  } catch (e) {
    return [];
  }
}



async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 0 }, // Bust cache for aggressive dev testing
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

async function getGlobalSettings() {
  try {
    const res = await fetch(`${API_URL}/api/global-settings`, {
      next: { revalidate: 3600 }, // Cache settings for an hour
    });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    return {};
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: paramSlug } = await params;
  const data = await getProduct(paramSlug);
  const settings = await getGlobalSettings();

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  const { id, name, slug, description, shortDescription, price, comparePrice, stock, unit, weight, categories, related, productType, priceRange, image } = data;
  const category = categories?.[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const absoluteImageUrl = image ? (image.startsWith('http') ? image : `${API_URL}${image}`) : "";

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <ProductViewTracker product={data} />
      <ProductSchema product={data} baseUrl={baseUrl} permalinkStructure={settings.permalink_structure} />
      {absoluteImageUrl && (
        <link rel="preload" as="image" href={absoluteImageUrl} fetchPriority="high" />
      )}
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 py-4">
        <div className="container mx-auto px-4 flex items-center text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/categories/${category.slug}`} className="hover:text-primary transition-colors">{category.name}</Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <ProductOverview product={data} />

        {/* Product Tabs Section */}
        <div className="mt-16">
          <ProductTabs product={data} />
        </div>

        {/* Upsell Products */}
        {data.resolvedUpsells?.length > 0 && (
          <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter italic">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.resolvedUpsells.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Downsell (Cross-sell) Products */}
        {data.resolvedDownsells?.length > 0 && (
          <div className="mt-20 border-t border-gray-100 dark:border-gray-800 pt-16">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter italic">
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.resolvedDownsells.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
