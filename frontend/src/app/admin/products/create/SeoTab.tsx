import { ProductFormData } from "./page";
import { useSettingsStore } from "@/store/settingsStore";

interface SeoTabProps {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export default function SeoTab({ formData, onChange }: SeoTabProps) {
  const { settings } = useSettingsStore();
  const permalinkStructure = settings.permalink_structure || "product";

  const update = (field: keyof ProductFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Search Engine Optimization</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              URL Slug
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                {permalinkStructure === "product" ? "/product/" : "/"}
              </span>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={e => update("slug", e.target.value)}
                placeholder="custom-product-url"
                className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Leave blank to auto-generate from the product name.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Meta Title
            </label>
            <input 
              type="text" 
              value={formData.metaTitle} 
              onChange={e => update("metaTitle", e.target.value)}
              placeholder="SEO optimized title..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Meta Keywords
            </label>
            <input 
              type="text" 
              value={formData.metaKeywords || ""} 
              onChange={e => update("metaKeywords", e.target.value)}
              placeholder="fresh, groceries, organic, ..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Meta Description
            </label>
            <textarea 
              value={formData.metaDescription} 
              onChange={e => update("metaDescription", e.target.value)} 
              rows={4}
              placeholder="Write a highly descriptive summary for search engines..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white resize-y transition-colors leading-relaxed" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
