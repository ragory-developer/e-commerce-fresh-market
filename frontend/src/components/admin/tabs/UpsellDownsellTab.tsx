"use client";
import { API_URL } from "@/lib/config";

import { useEffect, useState } from "react";
import Select from "react-select";
import { ProductFormData } from "@/app/admin/products/create/page";

interface Props {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export default function UpsellDownsellTab({ formData, onChange }: Props) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [products, setProducts] = useState<{ value: string; label: string, image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/categories`).then(r => r.json()),
      fetch(`${API_URL}/api/products?limit=1000`).then(r => r.json())
    ]).then(([catData, prodData]) => {
      if (catData?.data) {
        setCategories(catData.data.map((c: any) => ({ value: c.id, label: c.name })));
      }
      if (prodData?.data) {
        setProducts(prodData.data.map((p: any) => ({ value: p.id, label: p.name, image: p.image })));
      }
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">Upsell Products</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Upsell products are items which you recommend instead of the currently viewed product, for example, products that are more profitable or better quality.
          <b> You can choose specific products OR a category, not both.</b>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specific Products</label>
            <div className={`transition-opacity ${formData.upsellCategoryIds.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Select
                isMulti
                options={products}
                isLoading={loading}
                isDisabled={formData.upsellCategoryIds.length > 0}
                value={products.filter(p => formData.upsellProducts.includes(p.value))}
                onChange={(selected) => {
                  onChange({ ...formData, upsellProducts: selected.map((s: any) => s.value) });
                }}
                className="react-select-container text-gray-900"
                classNamePrefix="react-select"
                placeholder="Search products..."
                menuPosition="fixed"
              />
            </div>
            {formData.upsellCategoryIds.length > 0 && <p className="text-xs text-orange-500 mt-1">Disabled because categories are currently selected.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Category</label>
            <div className={`transition-opacity ${formData.upsellProducts.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Select
                isMulti
                options={categories}
                isLoading={loading}
                isDisabled={formData.upsellProducts.length > 0}
                value={categories.filter(c => formData.upsellCategoryIds.includes(c.value))}
                onChange={(selected) => {
                  onChange({ ...formData, upsellCategoryIds: selected.map((s: any) => s.value) });
                }}
                className="react-select-container text-gray-900"
                classNamePrefix="react-select"
                placeholder="Select category..."
                menuPosition="fixed"
              />
            </div>
            {formData.upsellProducts.length > 0 && <p className="text-xs text-orange-500 mt-1">Disabled because specific products are selected.</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">Downsell (Cross-sells) Products</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Downsell or cross-sell products are items which you promote in the cart or product page, based on the current product (e.g., related accessories).
          <b> You can choose specific products OR a category, not both.</b>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specific Products</label>
            <div className={`transition-opacity ${formData.downsellCategoryIds.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Select
                isMulti
                options={products}
                isLoading={loading}
                isDisabled={formData.downsellCategoryIds.length > 0}
                value={products.filter(p => formData.downsellProducts.includes(p.value))}
                onChange={(selected) => {
                  onChange({ ...formData, downsellProducts: selected.map((s: any) => s.value) });
                }}
                className="react-select-container text-gray-900"
                classNamePrefix="react-select"
                placeholder="Search products..."
                menuPosition="fixed"
              />
            </div>
            {formData.downsellCategoryIds.length > 0 && <p className="text-xs text-orange-500 mt-1">Disabled because categories are currently selected.</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Category</label>
            <div className={`transition-opacity ${formData.downsellProducts.length > 0 ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Select
                isMulti
                options={categories}
                isLoading={loading}
                isDisabled={formData.downsellProducts.length > 0}
                value={categories.filter(c => formData.downsellCategoryIds.includes(c.value))}
                onChange={(selected) => {
                  onChange({ ...formData, downsellCategoryIds: selected.map((s: any) => s.value) });
                }}
                className="react-select-container text-gray-900"
                classNamePrefix="react-select"
                placeholder="Select category..."
                menuPosition="fixed"
              />
            </div>
            {formData.downsellProducts.length > 0 && <p className="text-xs text-orange-500 mt-1">Disabled because specific products are selected.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
