import ProductDetailPage, { generateMetadata as productGenerateMetadata, generateStaticParams as productGenerateStaticParams } from "@/components/product/ProductPageTemplate";
import PageTemplate from "@/components/page/PageTemplate";
import { API_URL } from "@/lib/config";
import { Metadata } from "next";

export async function generateMetadata(props: any): Promise<Metadata> {
  const resolvedParams = await props.params;
  const productMeta = await productGenerateMetadata(props);
  
  if (productMeta?.title === "Product Not Found | FreshCart") {
    // Attempt to resolve as a Custom Page
    try {
      const res = await fetch(`${API_URL}/api/pages/${resolvedParams.slug}`, { next: { revalidate: 0 } });
      const json = await res.json();
      if (json.success && json.data) {
        const page = json.data;
        let pTitle = page.title;
        let pDesc = "Custom page";
        try {
          if (page.seoData) {
            const seo = typeof page.seoData === 'string' ? JSON.parse(page.seoData) : page.seoData;
            if (seo.title) pTitle = seo.title;
            if (seo.description) pDesc = seo.description;
          }
        } catch(e) {}
        return { title: pTitle, description: pDesc };
      }
    } catch(e) {}
  }
  
  return productMeta;
}

export async function generateStaticParams() {
  return productGenerateStaticParams(); 
}

export default async function RootSlugPage(props: any) {
  const resolvedParams = await props.params;
  
  // 1. Try fetching Product
  try {
    const res = await fetch(`${API_URL}/api/products/${resolvedParams.slug}`, { 
      next: { revalidate: 0 } 
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // It's a product
        return <ProductDetailPage params={props.params} />;
      }
    }
  } catch(e) {}

  // 2. Try fetching Custom Page
  try {
    const pageRes = await fetch(`${API_URL}/api/pages/${resolvedParams.slug}`, { 
      next: { revalidate: 0 } 
    });
    if (pageRes.ok) {
      const pageJson = await pageRes.json();
      if (pageJson.success && pageJson.data) {
        return <PageTemplate page={pageJson.data} />;
      }
    }
  } catch(e) {}

  // 3. Neither found, fallback to the generic NOT FOUND UI in ProductDetailPage
  return <ProductDetailPage params={props.params} />;
}
