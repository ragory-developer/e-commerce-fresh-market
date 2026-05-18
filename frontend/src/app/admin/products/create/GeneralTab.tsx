import { API_URL } from "@/lib/config";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import SearchableSelect from "@/components/admin/SearchableSelect";
import { ProductFormData } from "./page";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface TagItem {
  id: string;
  name: string;
}

interface GeneralTabProps {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
  excludeId?: string;
}

export default function GeneralTab({ formData, onChange, excludeId }: GeneralTabProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [availableTags, setAvailableTags] = useState<TagItem[]>([]);
  const [creatingTag, setCreatingTag] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugWarning, setSlugWarning] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/categories`)
      .then(r => r.json())
      .then(j => j.success && setCategories(j.data || []))
      .catch(console.error);

    fetch(`${API_URL}/api/brands?limit=50`)
      .then(r => r.json())
      .then(j => j.success && setBrands(j.data || []))
      .catch(console.error);

    fetch(`${API_URL}/api/tags`)
      .then(r => r.json())
      .then(j => j.success && setAvailableTags(j.data || []))
      .catch(console.error);
  }, []);

  const update = (field: keyof ProductFormData, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  useEffect(() => {
    if (!formData.slug) {
      setSlugWarning(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        const url = new URL(`${API_URL}/api/products/check-slug`);
        url.searchParams.append("slug", formData.slug);
        if (excludeId) url.searchParams.append("excludeId", excludeId);
        
        const res = await fetch(url.toString());
        const json = await res.json();
        if (json.success && !json.available) {
          setSlugWarning("This slug is already taken. Please enter a unique slug.");
        } else {
          setSlugWarning(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSlugChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.slug, excludeId]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  // Flatten categories for select
  const flatCats: { id: string; name: string; depth: number }[] = [];
  const flatten = (cats: Category[], depth = 0) => {
    cats.forEach(c => {
      flatCats.push({ id: c.id, name: c.name, depth });
      if (c.children?.length) flatten(c.children, depth + 1);
    });
  };
  flatten(categories);

  const categoryOptions = flatCats.map(c => ({
    value: c.id,
    label: `${"—".repeat(c.depth)} ${c.name}`
  }));

  const brandOptions = brands.map(b => ({
    value: b.id,
    label: b.name
  }));

  const tagOptions = availableTags.map(t => ({ value: t.id, label: t.name }));

  const handleCreateTag = async (inputValue: string) => {
    setCreatingTag(true);
    try {
      const newTagNames = inputValue.split(',').map(t => t.trim()).filter(Boolean);
      const createdTags: TagItem[] = [];
      const newTagIds: string[] = [];

      for (const tName of newTagNames) {
        const existing = availableTags.find(t => t.name.toLowerCase() === tName.toLowerCase());
        if (existing) {
          if (!formData.tags?.includes(existing.id)) newTagIds.push(existing.id);
        } else {
          const res = await fetch(`${API_URL}/api/tags`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: tName }),
          });
          const json = await res.json();
          if (json.success) {
            createdTags.push(json.data);
            newTagIds.push(json.data.id);
          }
        }
      }

      if (createdTags.length > 0) setAvailableTags(prev => [...prev, ...createdTags]);
      if (newTagIds.length > 0 || createdTags.length > 0) {
        update("tags", Array.from(new Set([...(formData.tags || []), ...newTagIds])));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingTag(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">General Information</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => update("name", e.target.value)} 
              required
              placeholder="e.g. Premium Cotton T-Shirt"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white font-medium transition-colors" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Custom Slug (Optional)</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.slug || ""} 
                onChange={e => update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} 
                placeholder="Leave blank to auto-generate from name"
                className={`w-full px-4 py-2.5 rounded-lg border ${slugWarning ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white font-medium transition-colors`} 
              />
              {slugChecking && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>}
            </div>
            {slugWarning ? (
              <p className="text-xs text-red-500 mt-2 font-medium">{slugWarning}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-2">Custom URL identifier. Must be unique. Only lowercase letters, numbers, and hyphens.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Short Description</label>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <ReactQuill 
                theme="snow" 
                value={formData.shortDescription} 
                onChange={val => update("shortDescription", val)} 
                modules={quillModules}
                className="h-32 mb-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">A concise summary of the product.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Description</label>
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <ReactQuill 
                theme="snow" 
                value={formData.description} 
                onChange={val => update("description", val)} 
                modules={quillModules}
                className="h-64 mb-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pricing & Inventory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Regular Price (৳) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              step="0.01" 
              value={formData.price} 
              onChange={e => update("price", e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Special Price</label>
            <input 
              type="number" 
              step="0.01" 
              value={formData.specialPrice} 
              onChange={e => update("specialPrice", e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Special Price Start</label>
            <input 
              type="datetime-local" 
              value={formData.specialPriceStart} 
              onChange={e => update("specialPriceStart", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Special Price End</label>
            <input 
              type="datetime-local" 
              value={formData.specialPriceEnd} 
              onChange={e => update("specialPriceEnd", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              value={formData.stock} 
              onChange={e => update("stock", e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
              <select 
                value={formData.unit} 
                onChange={e => update("unit", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors"
              >
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="g">Gram</option>
                <option value="l">Liter</option>
                <option value="ml">Milliliter</option>
                <option value="pack">Pack</option>
                <option value="box">Box</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Weight</label>
              <input 
                type="text" 
                value={formData.weight} 
                onChange={e => update("weight", e.target.value)}
                placeholder="250g, 1kg..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-8">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Organization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Categories <span className="text-red-500">*</span></label>
            <SearchableSelect
              options={categoryOptions}
              value={formData.categoryIds || []}
              onChange={(val: string[]) => update("categoryIds", val)}
              placeholder="Select categories..."
              className="text-gray-900 dark:text-white"
              isMulti
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Brand</label>
            <SearchableSelect
              options={brandOptions}
              value={formData.brandId}
              onChange={(val: string) => update("brandId", val)}
              placeholder="Select brand..."
              className="text-gray-900 dark:text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
            <SearchableSelect
              options={tagOptions}
              value={formData.tags || []}
              onChange={(val: string[]) => update("tags", val)}
              placeholder="Search or type to add tags..."
              className="text-gray-900 dark:text-white"
              isMulti
              creatable
              onCreateOption={handleCreateTag}
              isLoading={creatingTag}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <input 
              type="checkbox" 
              checked={formData.featured} 
              onChange={e => update("featured", e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
            />
            <div>
              <span className="font-semibold text-sm text-gray-900 dark:text-white block">Featured Product</span>
              <span className="text-xs text-gray-500">Show this product in featured sections</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
