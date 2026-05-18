"use client";
import { API_URL } from "@/lib/config";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, ChevronUp, X, Filter, RotateCcw, Search } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Specification {
  id: string;
  name: string;
  slug: string;
  values: { id: string; value: string }[];
}

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [categories, setCategories] = useState<Category[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",") || []
  );
  
  // Format: "Color:Red,Blue|Size:M,L"
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>(() => {
    const specsParam = searchParams.get("attributes");
    if (!specsParam) return {};
    const result: Record<string, string[]> = {};
    specsParam.split("|").forEach(group => {
      const [name, values] = group.split(":");
      if (name && values) {
        result[name] = values.split(",");
      }
    });
    return result;
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    categories: true,
    specifications: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, specRes] = await Promise.all([
          fetch(`${API_URL}/api/categories`),
          fetch(`${API_URL}/api/specifications?filter=true`)
        ]);
        const catJson = await catRes.json();
        const specJson = await specRes.json();
        setCategories(catJson.data || []);
        setSpecifications(specJson.data || []);
      } catch (error) {
        console.error("Failed to fetch filter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const applyFilters = (overrides?: {
    search?: string;
    category?: string[];
    specs?: Record<string, string[]>;
  }) => {
    const currentQ = overrides?.search !== undefined ? overrides.search : searchQuery;
    const currentCategories = overrides?.category !== undefined ? overrides.category : selectedCategories;
    const currentSpecs = overrides?.specs !== undefined ? overrides.specs : selectedSpecs;

    const params: Record<string, string | null> = {
      search: currentQ || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      category: currentCategories.length > 0 ? currentCategories.join(",") : null,
    };

    const specString = Object.entries(currentSpecs)
      .filter(([_, values]) => values.length > 0)
      .map(([name, values]) => `${name}:${values.join(",")}`)
      .join("|");
    
    params.attributes = specString || null;

    router.push(`${pathname}?${createQueryString(params)}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSelectedSpecs({});
    router.push(pathname);
  };

  const toggleCategory = (slug: string) => {
    const newCategories = selectedCategories.includes(slug) 
      ? selectedCategories.filter(s => s !== slug) 
      : [...selectedCategories, slug];
    setSelectedCategories(newCategories);
    applyFilters({ category: newCategories });
  };

  const toggleSpecValue = (specName: string, value: string) => {
    const current = selectedSpecs[specName] || [];
    const updated = current.includes(value) 
      ? current.filter(v => v !== value) 
      : [...current, value];
    const newSpecs = { ...selectedSpecs, [specName]: updated };
    setSelectedSpecs(newSpecs);
    applyFilters({ specs: newSpecs });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) return <div className="animate-pulse space-y-4">
    {[1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl" />)}
  </div>;

  return (
    <div className="flex flex-col gap-6 w-full lg:w-72 shrink-0">
      {/* Search Input */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl text-sm font-bold text-gray-900 dark:text-white outline-none"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
           Filters
        </h2>
        <button 
          onClick={clearFilters}
          className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors flex items-center gap-1 uppercase tracking-widest"
        >
          <RotateCcw size={12} /> Clear all
        </button>
      </div>

      {/* Price Range Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between p-4 font-black text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Price Range
          {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.price && (
          <div className="p-4 pt-0 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <div className="w-2 h-px bg-gray-300 dark:bg-gray-700" />
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">৳</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
            
            <div className="px-2 py-4">
              <Slider
                range
                min={0}
                max={50000}
                step={100}
                value={[Number(minPrice) || 0, Number(maxPrice) || 50000]}
                onChange={(val: any) => {
                  setMinPrice(val[0].toString());
                  setMaxPrice(val[1].toString());
                }}
                trackStyle={[{ backgroundColor: "var(--color-primary, #10b981)" }]}
                handleStyle={[
                  { borderColor: "var(--color-primary, #10b981)", backgroundColor: "#fff" },
                  { borderColor: "var(--color-primary, #10b981)", backgroundColor: "#fff" }
                ]}
              />
            </div>

            <button 
              onClick={() => applyFilters()}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg shadow-gray-200 dark:shadow-none"
            >
              Apply Price
            </button>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <button 
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between p-4 font-black text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Categories
          {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expandedSections.categories && (
          <div className="p-4 pt-0 max-h-60 overflow-y-auto scrollbar-hide space-y-1">
            {categories.map((cat) => (
              <label 
                key={cat.id} 
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="appearance-none w-5 h-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 checked:bg-primary checked:border-primary transition-all"
                  />
                  {selectedCategories.includes(cat.slug) && <X size={12} className="absolute text-white stroke-[4]" />}
                </div>
                <span className={`text-sm font-bold ${selectedCategories.includes(cat.slug) ? "text-gray-900 dark:text-white" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}>
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Specifications Section */}
      {specifications.map((spec) => (
        <div key={spec.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <button 
            onClick={() => toggleSection(spec.id)}
            className="w-full flex items-center justify-between p-4 font-black text-sm uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {spec.name}
            {expandedSections[spec.id] === false ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {expandedSections[spec.id] !== false && (
            <div className="p-4 pt-0 max-h-60 overflow-y-auto scrollbar-hide space-y-1">
              {spec.values.map((v) => (
                <label 
                  key={v.id} 
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={(selectedSpecs[spec.name] || []).includes(v.value)}
                      onChange={() => toggleSpecValue(spec.name, v.value)}
                      className="appearance-none w-5 h-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 checked:bg-primary checked:border-primary transition-all"
                    />
                    {(selectedSpecs[spec.name] || []).includes(v.value) && <X size={12} className="absolute text-white stroke-[4]" />}
                  </div>
                  <span className={`text-sm font-bold ${(selectedSpecs[spec.name] || []).includes(v.value) ? "text-gray-900 dark:text-white" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"}`}>
                    {v.value}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
