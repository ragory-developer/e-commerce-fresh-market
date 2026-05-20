"use client";

import type { SectionEditorProps } from "./types";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

type StringPatch = Record<string, unknown>;

export function InputField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <input
        id={id}
        data-builder-input
        type="text"
        value={String(value || "")}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

export function MediaPickerField({
  id,
  label,
  value,
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const imageUrl = String(value || "");

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <input type="hidden" id={id} value={imageUrl} />
      <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {imageUrl ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-650 bg-white shrink-0">
            <img src={imageUrl} alt="Selected" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-750 flex items-center justify-center text-gray-400 shrink-0">
            <ImageIcon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
            {imageUrl ? imageUrl.split("/").pop() : "No image selected"}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
            {imageUrl || "Click browse to select"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition shrink-0"
        >
          Browse
        </button>
        {imageUrl && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-2 transition shrink-0"
          >
            Remove
          </button>
        )}
      </div>

      <MediaLibraryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={(_, url) => {
          onChange(url);
        }}
        preferredSize="full"
      />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <textarea
        id={id}
        data-builder-input
        value={String(value || "")}
        placeholder={placeholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

export function SegmentedControl({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <div className="flex rounded-lg border border-gray-200 bg-gray-100/80 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            id={option.value === value ? id : undefined}
            data-builder-input={option.value === value ? true : undefined}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-md px-2 py-2 text-xs font-extrabold transition ${
              value === option.value
                ? "bg-white text-emerald-600 shadow"
                : "text-gray-500 hover:bg-white/40 hover:text-gray-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-b border-gray-100 pb-5 last:border-b-0">
      <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">{title}</h4>
      {children}
    </div>
  );
}

const alignOptions = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" },
];

const imageAlignOptions = [
  { label: "Image Left", value: "left" },
  { label: "Image Right", value: "right" },
];

function sectionInputId(sectionId: string, field: string) {
  return `input-${sectionId}-${field}`;
}

export function ProductEditorFields({ section, props, categories, onChange }: { section: any; props: any; categories: any[]; onChange: (patch: any) => void }) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  const sourceType = props.sourceType || "all";
  const layoutType = props.layoutType || "grid";
  const cols = props.cols != null ? Number(props.cols) : 5;
  const gap = props.gap || "md";
  const cardVariant = props.cardVariant || "classic";
  const cardRadius = props.cardRadius || "3xl";
  const badgeStyle = props.badgeStyle || "pill";

  const sourceTypeOptions = [
    { label: "All Products", value: "all" },
    { label: "Filter by Category", value: "category" },
    { label: "Featured Products", value: "featured" },
    { label: "Products on Sale", value: "sale" },
    { label: "Manual Selection", value: "manual" },
  ];

  const sortOptions = [
    { label: "Default Order", value: "default" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Customer Rating", value: "rating" },
    { label: "Biggest Discount", value: "discount" },
  ];

  const colOptions = [
    { label: "3 Cols", value: "3" },
    { label: "4 Cols", value: "4" },
    { label: "5 Cols", value: "5" },
    { label: "6 Cols", value: "6" },
  ];

  const gapOptions = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
  ];

  const variantOptions = [
    { label: "Classic Card", value: "classic" },
    { label: "Sleek Glass", value: "sleek" },
    { label: "Minimalist", value: "minimal" },
    { label: "Festive Shimmer", value: "festive" },
  ];

  const radiusOptions = [
    { label: "No Rounding (None)", value: "none" },
    { label: "Small (SM)", value: "sm" },
    { label: "Medium (MD)", value: "md" },
    { label: "Large (LG)", value: "lg" },
    { label: "Extra Large (XL)", value: "xl" },
    { label: "Double XL (2XL)", value: "2xl" },
    { label: "Triple XL (3XL)", value: "3xl" },
    { label: "Full Capsule (Full)", value: "full" },
  ];

  const badgeStyleOptions = [
    { label: "Pill Tag", value: "pill" },
    { label: "Tight Corner", value: "corner" },
    { label: "Diagonal Ribbon", value: "ribbon" },
  ];

  return (
    <>
      <EditorSection title="Data Source & Query">
        <label className="block">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Source Type
          </span>
          <select
            id={inputId("sourceType")}
            value={sourceType}
            onChange={(e) => onChange({ sourceType: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          >
            {sourceTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {sourceType === "category" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
              Category
            </span>
            <select
              id={inputId("showcaseCategoryId")}
              value={String(props.showcaseCategoryId || props.categoryId || "all")}
              onChange={(e) => onChange({ showcaseCategoryId: e.target.value, categoryId: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {sourceType === "manual" && (
          <InputField
            id={inputId("manualProductIds")}
            label="Product IDs / Slugs (Comma separated)"
            value={props.manualProductIds}
            placeholder="e.g. skin-glow-serum, organic-aloe-gel"
            onChange={(manualProductIds) => onChange({ manualProductIds })}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
              Max Items
            </span>
            <input
              id={inputId("limit")}
              type="number"
              value={props.limit != null ? Number(props.limit) : 10}
              min={1}
              max={50}
              onChange={(e) => onChange({ limit: Number(e.target.value) || 10 })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
              Sort By
            </span>
            <select
              id={inputId("sort")}
              value={String(props.sort || "default")}
              onChange={(e) => onChange({ sort: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </EditorSection>

      <EditorSection title="Layout Configuration">
        <SegmentedControl
          id={inputId("layoutType")}
          label="Display Style"
          value={layoutType}
          options={[
            { label: "Grid View", value: "grid" },
            { label: "Carousel Slider", value: "carousel" },
          ]}
          onChange={(val) => onChange({ layoutType: val })}
        />

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
              Grid/Slide columns
            </span>
            <select
              id={inputId("cols")}
              value={String(cols)}
              onChange={(e) => onChange({ cols: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              {colOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
              Item Spacing
            </span>
            <select
              id={inputId("gap")}
              value={gap}
              onChange={(e) => onChange({ gap: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            >
              {gapOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </EditorSection>

      <EditorSection title="Card Aesthetic Chrome">
        <SegmentedControl
          id={inputId("cardVariant")}
          label="Card Styling Variant"
          value={cardVariant}
          options={variantOptions}
          onChange={(val) => onChange({ cardVariant: val })}
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Card Corners Radius
          </span>
          <select
            id={inputId("cardRadius")}
            value={cardRadius}
            onChange={(e) => onChange({ cardRadius: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          >
            {radiusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {props.showBadge !== false && (
          <SegmentedControl
            id={inputId("badgeStyle")}
            label="Badge Shape & Layout"
            value={badgeStyle}
            options={badgeStyleOptions}
            onChange={(val) => onChange({ badgeStyle: val })}
          />
        )}
      </EditorSection>

      <EditorSection title="Card Features & Elements">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Badges
            </span>
            <SegmentedControl
              id={inputId("showBadge")}
              label=""
              value={props.showBadge !== false ? "yes" : "no"}
              options={[
                { label: "Show", value: "yes" },
                { label: "Hide", value: "no" },
              ]}
              onChange={(val) => onChange({ showBadge: val === "yes" })}
            />
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Rating
            </span>
            <SegmentedControl
              id={inputId("showRating")}
              label=""
              value={props.showRating !== false ? "yes" : "no"}
              options={[
                { label: "Show", value: "yes" },
                { label: "Hide", value: "no" },
              ]}
              onChange={(val) => onChange({ showRating: val === "yes" })}
            />
          </div>

          <div>
            <span className="mb-1 block text-[10px] font-black uppercase tracking-wider text-gray-400">
              Add-To-Cart
            </span>
            <SegmentedControl
              id={inputId("showAddToCart")}
              label=""
              value={props.showAddToCart !== false ? "yes" : "no"}
              options={[
                { label: "Show", value: "yes" },
                { label: "Hide", value: "no" },
              ]}
              onChange={(val) => onChange({ showAddToCart: val === "yes" })}
            />
          </div>
        </div>
      </EditorSection>
    </>
  );
}

export function HeroBannerEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <TextAreaField id={inputId("description")} label="Description" value={props.description} onChange={(description) => onChange({ description })} />
        <InputField id={inputId("badgeText")} label="Badge Text" value={props.badgeText} placeholder="New Collection 2026" onChange={(badgeText) => onChange({ badgeText })} />
        <SegmentedControl id={inputId("textAlign")} label="Text Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Floating Offer Badge">
        <InputField id={inputId("offerText")} label="Offer Headline" value={props.offerText} placeholder="Up to 40% OFF" onChange={(offerText) => onChange({ offerText })} />
        <InputField id={inputId("offerSubtext")} label="Offer Subtext" value={props.offerSubtext} placeholder="Limited Time" onChange={(offerSubtext) => onChange({ offerSubtext })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} placeholder="/products" onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Hero Image" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
      </EditorSection>
    </div>
  );
}

export function SpecialOffersEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);

  const gradientOptions = [
    { label: "Blue Indigo", value: "from-blue-600 via-blue-700 to-indigo-800" },
    { label: "Emerald Teal", value: "from-emerald-600 via-teal-700 to-emerald-900" },
    { label: "Rose Red", value: "from-rose-600 via-red-700 to-rose-900" },
    { label: "Amber Gold", value: "from-amber-500 via-orange-600 to-red-700" },
    { label: "Purple Violet", value: "from-purple-600 via-violet-700 to-indigo-900" },
    { label: "Slate Dark", value: "from-slate-700 via-gray-800 to-slate-900" },
  ];

  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Text Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Banner Style">
        <label className="block">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Gradient Color
          </span>
          <select
            id={inputId("bgColor")}
            value={String(props.bgColor || "from-blue-600 via-blue-700 to-indigo-800")}
            onChange={(e) => onChange({ bgColor: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          >
            {gradientOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("leftImageSrc")} label="Left Image" value={props.leftImageSrc} onChange={(leftImageSrc) => onChange({ leftImageSrc })} />
        <MediaPickerField id={inputId("rightImageSrc")} label="Right Image" value={props.rightImageSrc} onChange={(rightImageSrc) => onChange({ rightImageSrc })} />
      </EditorSection>
    </div>
  );
}

export function ProductShowcaseEditor({ section, props, categories, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Header Text">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <ProductEditorFields section={section} props={props} categories={categories} onChange={onChange} />
    </div>
  );
}

export function PromoBadgeGridEditor({ section, props, onChange }: SectionEditorProps<{ badges?: any[] }>) {
  const badges = props.badges || [];
  
  const updateBadge = (index: number, patch: any) => {
    const updated = [...badges];
    updated[index] = { ...updated[index], ...patch };
    onChange({ badges: updated });
  };

  const gradientOptions = [
    { label: "Blue Gradient", value: "from-blue-500 to-blue-700" },
    { label: "Emerald Gradient", value: "from-emerald-500 to-teal-700" },
    { label: "Purple Gradient", value: "from-purple-500 to-indigo-700" },
    { label: "Rose Gradient", value: "from-rose-500 to-pink-700" },
    { label: "Gold Gradient", value: "from-amber-500 to-yellow-600" },
    { label: "Red Gradient", value: "from-red-600 to-orange-500" },
  ];

  const iconOptions = [
    { label: "Gift Box", value: "Gift" },
    { label: "Package / Box", value: "Package" },
    { label: "Stacked Boxes", value: "Boxes" },
    { label: "Sparkles", value: "Sparkles" },
    { label: "Heart", value: "Heart" },
    { label: "Star", value: "Star" },
    { label: "Percent / Discount", value: "Percent" },
    { label: "Shopping Bag", value: "ShoppingBag" },
    { label: "Flame / Fire", value: "Flame" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        Badge Cards (Exactly 4 Badges)
      </div>
      {Array.from({ length: 4 }).map((_, index) => {
        const badge = badges[index] || { title: "", subtitle: "", iconName: "Gift", bgColor: "from-blue-500 to-blue-700", href: "" };
        const badgeId = (field: string) => sectionInputId(section.id, `badge_${index}_${field}`);

        return (
          <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wide">
              Badge Card #{index + 1}
            </div>
            <InputField
              id={badgeId("title")}
              label="Title"
              value={badge.title}
              onChange={(title) => updateBadge(index, { title })}
            />
            <InputField
              id={badgeId("subtitle")}
              label="Subtitle"
              value={badge.subtitle}
              onChange={(subtitle) => updateBadge(index, { subtitle })}
            />
            <InputField
              id={badgeId("href")}
              label="Link (href)"
              value={badge.href}
              onChange={(href) => updateBadge(index, { href })}
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Icon
              </span>
              <select
                id={badgeId("icon")}
                value={badge.iconName || "Gift"}
                onChange={(e) => updateBadge(index, { iconName: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Color Gradient Theme
              </span>
              <select
                id={badgeId("color")}
                value={badge.bgColor || "from-blue-500 to-blue-700"}
                onChange={(e) => updateBadge(index, { bgColor: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {gradientOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );
      })}
    </div>
  );
}

export function TestimonialEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; textAlign?: string; testimonials?: any[] }>) {
  const testimonials = props.testimonials || [];
  const inputId = (field: string) => sectionInputId(section.id, field);

  const updateTestimonial = (index: number, patch: any) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], ...patch };
    onChange({ testimonials: updated });
  };

  const ratingOptions = [
    { label: "⭐⭐⭐⭐⭐ (5 Stars)", value: 5 },
    { label: "⭐⭐⭐⭐ (4 Stars)", value: 4 },
    { label: "⭐⭐⭐ (3 Stars)", value: 3 },
    { label: "⭐⭐ (2 Stars)", value: 2 },
    { label: "⭐ (1 Star)", value: 1 },
  ];

  return (
    <div className="space-y-6">
      <EditorSection title="Header">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        Testimonial Cards (Exactly 4 Reviews)
      </div>
      {Array.from({ length: 4 }).map((_, index) => {
        const item = testimonials[index] || { name: "", avatar: "", rating: 5, review: "", product: "" };
        const itemId = (field: string) => sectionInputId(section.id, `review_${index}_${field}`);

        return (
          <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wide">
              Reviewer #{index + 1}
            </div>
            <InputField
              id={itemId("name")}
              label="Reviewer Name"
              value={item.name}
              onChange={(name) => updateTestimonial(index, { name })}
            />
            <MediaPickerField
              id={itemId("avatar")}
              label="Avatar Image"
              value={item.avatar}
              onChange={(avatar) => updateTestimonial(index, { avatar })}
            />
            <InputField
              id={itemId("product")}
              label="Product Reviewed"
              value={item.product}
              onChange={(product) => updateTestimonial(index, { product })}
            />
            <label className="block">
              <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
                Rating
              </span>
              <select
                id={itemId("rating")}
                value={item.rating || 5}
                onChange={(e) => updateTestimonial(index, { rating: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              >
                {ratingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <TextAreaField
              id={itemId("review")}
              label="Review Text"
              value={item.review}
              onChange={(review) => updateTestimonial(index, { review })}
            />
          </div>
        );
      })}
    </div>
  );
}

export function HotDealsEditor({ section, props, categories, onChange }: SectionEditorProps<any>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Header Text">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>
      <ProductEditorFields section={section} props={props} categories={categories} onChange={onChange} />
    </div>
  );
}

export function ConsultationEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; badgeText?: string; features?: string[]; ctaText?: string; ctaHref?: string; imageSrc?: string; imageAlign?: string }>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  const features = (props.features as string[] | undefined) || ["Personalized skin analysis", "Custom routine recommendations", "Expert product matching"];

  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    onChange({ features: updated } as any);
  };

  const addFeature = () => {
    onChange({ features: [...features, "New feature"] } as any);
  };

  const removeFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    onChange({ features: updated } as any);
  };

  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title } as any)} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle } as any)} />
        <InputField id={inputId("badgeText")} label="Badge Text" value={props.badgeText} placeholder="Expert Advice" onChange={(badgeText) => onChange({ badgeText } as any)} />
      </EditorSection>
      <EditorSection title="Feature Bullet Points">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <InputField
                id={inputId(`feature_${index}`)}
                label={`Bullet #${index + 1}`}
                value={feature}
                onChange={(value) => updateFeature(index, value)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="mt-5 text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-2 transition shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 transition"
        >
          + Add Bullet Point
        </button>
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText } as any)} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref } as any)} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Banner Image" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc } as any)} />
        <SegmentedControl id={inputId("imageAlign")} label="Layout" value={props.imageAlign || "right"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign } as any)} />
      </EditorSection>
    </div>
  );
}

export function RoutineEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <TextAreaField id={inputId("description")} label="Description" value={props.description} onChange={(description) => onChange({ description })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        <SegmentedControl id={inputId("imageAlign")} label="Layout" value={props.imageAlign || "left"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign })} />
      </EditorSection>
    </div>
  );
}

export function NewArrivalsEditor({ section, props, categories, onChange }: SectionEditorProps<any>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Header Text">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <InputField id={inputId("ctaHref")} label="View All Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <ProductEditorFields section={section} props={props} categories={categories} onChange={onChange} />
    </div>
  );
}

export function StaticSectionEditor() {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm font-medium text-gray-500">
      This section uses dynamic storefront data and has no editable fields yet.
    </div>
  );
}
