"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Check, Settings, Image as ImageIcon, Layers, SlidersHorizontal, BarChart, ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import GeneralTab from "../../create/GeneralTab";
import MediaTab from "../../create/MediaTab";
import SeoTab from "../../create/SeoTab";
import VariationTab, { VariantRow } from "@/components/admin/tabs/VariationTab";
import SpecificationTabWrapper, { SimpleSpecification } from "@/components/admin/tabs/SpecificationTabWrapper";
import FaqTab from "@/components/admin/tabs/FaqTab";
import UpsellDownsellTab from "@/components/admin/tabs/UpsellDownsellTab";

export interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  specialPrice: string;
  specialPriceStart: string;
  specialPriceEnd: string;
  stock: string;
  image: string;
  images: string;
  unit: string;
  weight: string;
  featured: boolean;
  categoryIds: string[];
  brandId: string;
  tags: string[];
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  slug: string;

  // Upsell / Downsell
  upsellProducts: string[];
  upsellCategoryIds: string[];
  downsellProducts: string[];
  downsellCategoryIds: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [productId, setProductId] = useState<string | null>(null);

  // Product form state
  const [productData, setProductData] = useState<ProductFormData>({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    specialPrice: "",
    specialPriceStart: "",
    specialPriceEnd: "",
    stock: "0",
    image: "",
    images: "",
    unit: "piece",
    weight: "",
    featured: false,
    categoryIds: [],
    brandId: "",
    tags: [],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    slug: "",
    upsellProducts: [],
    upsellCategoryIds: [],
    downsellProducts: [],
    downsellCategoryIds: [],
  });

  // Variation state
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Specifications
  const [specifications, setSpecifications] = useState<SimpleSpecification[]>([]);
  
  // FAQs
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);

  useEffect(() => {
    if (!slug) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          const p = json.data;
          setProductId(p.id);
          
          setProductData({
            name: p.name || "",
            description: p.description || "",
            shortDescription: p.shortDescription || "",
            price: p.price?.toString() || "",
            specialPrice: p.specialPrice?.toString() || "",
            specialPriceStart: p.specialPriceStart ? new Date(p.specialPriceStart).toISOString().split('T')[0] : "",
            specialPriceEnd: p.specialPriceEnd ? new Date(p.specialPriceEnd).toISOString().split('T')[0] : "",
            stock: p.stock?.toString() || "0",
            image: p.image || "",
            images: Array.isArray(p.images) ? p.images.join("\n") : (p.images || ""),
            unit: p.unit || "piece",
            weight: p.weight || "",
            featured: p.featured || false,
            categoryIds: p.categories?.map((c: any) => c.id) || [],
            brandId: p.brandId || "",
            tags: p.tags?.map((t: any) => t.id) || [],
            metaTitle: p.seoData?.title || "",
            metaDescription: p.seoData?.description || "",
            metaKeywords: p.seoData?.keywords || "",
            slug: p.slug || "",
            upsellProducts: p.upsellProducts || [],
            upsellCategoryIds: p.upsellCategoryIds || [],
            downsellProducts: p.downsellProducts || [],
            downsellCategoryIds: p.downsellCategoryIds || [],
          });

          // Initialize specifications
          if (p.specifications && Array.isArray(p.specifications)) {
            setSpecifications(p.specifications);
          }

          // Initialize FAQs
          if (p.faqs && Array.isArray(p.faqs)) {
            setFaqs(p.faqs);
          }

          if (p.variants && Array.isArray(p.variants)) {
            setVariants(p.variants.map((v: any) => ({
              id: v.id,
              isDefault: v.isDefault,
              enabled: v.enabled,
              image: v.image || "",
              price: v.price?.toString() || "",
              specialPrice: v.specialPrice?.toString() || "",
              specialPriceStart: v.specialPriceStart ? new Date(v.specialPriceStart).toISOString().split('T')[0] : "",
              specialPriceEnd: v.specialPriceEnd ? new Date(v.specialPriceEnd).toISOString().split('T')[0] : "",
              sku: v.sku || "",
              attributes: v.attributes?.map((a: any) => ({
                name: a.name,
                value: a.value
              })) || []
            })));
          }
        }
      } catch (e) {
        console.error("Failed to fetch product", e);
        alert("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleUpdate = async () => {
    if (!productData.name || !productData.price || productData.categoryIds.length === 0) {
      alert("Please fill in Product Name, Price, and select at least one Category.");
      return;
    }
    if (!productId) return;

    setSaving(true);
    try {
      const galleryImages = productData.images
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean);

      const body: any = {
        name: productData.name,
        description: productData.description || null,
        shortDescription: productData.shortDescription || null,
        price: parseFloat(productData.price),
        specialPrice: productData.specialPrice ? parseFloat(productData.specialPrice) : null,
        specialPriceStart: productData.specialPriceStart || null,
        specialPriceEnd: productData.specialPriceEnd || null,
        stock: parseInt(productData.stock) || 0,
        image: productData.image || null,
        images: galleryImages,
        unit: productData.unit,
        weight: productData.weight || null,
        featured: productData.featured,
        categoryIds: productData.categoryIds,
        brandId: productData.brandId || null,
        tags: productData.tags || [],
        seoData: {
          title: productData.metaTitle || null,
          description: productData.metaDescription || null,
          keywords: productData.metaKeywords || null,
        },
        slug: productData.slug || null,
        productType: variants.length > 0 ? "VARIABLE" : "SIMPLE",
        specifications: specifications.length > 0 ? specifications : null,
        faqs: faqs.length > 0 ? faqs : null,
        upsellProducts: productData.upsellProducts.length > 0 ? productData.upsellProducts : null,
        upsellCategoryIds: productData.upsellCategoryIds.length > 0 ? productData.upsellCategoryIds : null,
        downsellProducts: productData.downsellProducts.length > 0 ? productData.downsellProducts : null,
        downsellCategoryIds: productData.downsellCategoryIds.length > 0 ? productData.downsellCategoryIds : null,
      };

      // Include variants if any
      if (variants.length > 0) {
        body.variants = variants.map((v, idx) => ({
          id: v.id || null,
          sku: v.sku || null,
          price: parseFloat(v.price) || parseFloat(productData.price) || 0,
          specialPrice: v.specialPrice ? parseFloat(v.specialPrice) : null,
          specialPriceStart: v.specialPriceStart || null,
          specialPriceEnd: v.specialPriceEnd || null,
          stock: 0,
          image: v.image || null,
          isDefault: v.isDefault,
          enabled: v.enabled,
          attributes: v.attributes.filter((a: any) => a.value.trim()),
        }));
      }

      const res = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to update product");
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "specifications", label: "Specifications", icon: SlidersHorizontal },
    { id: "variations", label: "Variations", icon: Layers },
    { id: "faqs", label: "FAQs", icon: Settings },
    { id: "seo", label: "SEO", icon: BarChart },
    { id: "upsell", label: "Upsell/Downsell", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="font-medium text-lg text-gray-900 dark:text-white">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 mb-2 transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Back to Products
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Edit Product</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Update the product details and configuration.
          </p>
        </div>
        <button onClick={handleUpdate} disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
          <Check size={18} /> {saving ? "Saving..." : "Update Product"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row min-h-[600px]">
        {/* Left Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-700 p-4 shrink-0 flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg transition-colors text-left ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white border border-transparent"
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-blue-600 dark:text-blue-500" : "text-gray-400"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-6 lg:p-10 bg-white dark:bg-gray-800 overflow-y-auto">
          {activeTab === "general" && (
            <GeneralTab key={productId} formData={productData} onChange={setProductData} excludeId={productId || undefined} />
          )}
          {activeTab === "media" && (
            <MediaTab key={productId} formData={productData} onChange={setProductData} />
          )}
          {activeTab === "specifications" && (
            <SpecificationTabWrapper 
              specifications={specifications} 
              onChange={setSpecifications} 
            />
          )}
          {activeTab === "variations" && (
            <div className="animate-in fade-in duration-300">
              <VariationTab
                variants={variants}
                onChange={setVariants}
                productAttributes={specifications.map(s => ({ name: s.name, value: s.value }))}
              />
            </div>
          )}
          {activeTab === "faqs" && (
            <FaqTab faqs={faqs} onChange={setFaqs} />
          )}
          {activeTab === "seo" && (
            <SeoTab key={productId} formData={productData} onChange={setProductData} />
          )}
          {activeTab === "upsell" && (
            <UpsellDownsellTab key={productId} formData={productData} onChange={setProductData} />
          )}
        </div>
      </div>
    </div>
  );
}
