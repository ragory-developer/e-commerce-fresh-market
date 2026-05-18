"use client";
import { API_URL } from "@/lib/config";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Settings, Image as ImageIcon, Layers, SlidersHorizontal, BarChart, TrendingUp } from "lucide-react";
import GeneralTab from "./GeneralTab";
import MediaTab from "./MediaTab";
import SeoTab from "./SeoTab";
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

export default function CreateProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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

  const handlePublish = async () => {
    if (!productData.name || !productData.price || productData.categoryIds.length === 0) {
      alert("Please fill in Product Name, Price, and select at least one Category.");
      return;
    }

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
        specifications: specifications.length > 0 ? specifications : null,
        faqs: faqs.length > 0 ? faqs : null,
        upsellProducts: productData.upsellProducts.length > 0 ? productData.upsellProducts : null,
        upsellCategoryIds: productData.upsellCategoryIds.length > 0 ? productData.upsellCategoryIds : null,
        downsellProducts: productData.downsellProducts.length > 0 ? productData.downsellProducts : null,
        downsellCategoryIds: productData.downsellCategoryIds.length > 0 ? productData.downsellCategoryIds : null,
      };

      // Include variants if any
      if (variants.length > 0) {
        body.productType = "VARIABLE";
        body.variants = variants.map((v, idx) => ({
          sku: v.sku || null,
          price: parseFloat(v.price) || body.price,
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

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create product");
      }
    } catch (error) {
      alert("Network error. Is the backend running?");
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

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Create Product</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Build out your product utilizing the WordPress-style creation tabs.
          </p>
        </div>
        <button onClick={handlePublish} disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50">
          <Check size={18} /> {saving ? "Saving..." : "Save & Publish"}
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
            <GeneralTab formData={productData} onChange={setProductData} />
          )}
          {activeTab === "media" && (
            <MediaTab formData={productData} onChange={setProductData} />
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
            <SeoTab formData={productData} onChange={setProductData} />
          )}
          {activeTab === "upsell" && (
            <UpsellDownsellTab formData={productData} onChange={setProductData} />
          )}
        </div>
      </div>
    </div>
  );
}
