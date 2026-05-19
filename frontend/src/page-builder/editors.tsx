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

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <div className="flex gap-2">
        <input
          id={id}
          data-builder-input
          type="text"
          value={String(value || "")}
          placeholder="https://..."
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shrink-0"
        >
          <ImageIcon size={16} />
          Browse
        </button>
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

export function HeroBannerEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Text Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
        <SegmentedControl 
          id={inputId("themeVariant")} 
          label="Theme Style" 
          value={props.themeVariant || "default"} 
          options={[
            { label: "Default", value: "default" },
            { label: "Eid", value: "eid" },
            { label: "Puja", value: "puja" }
          ]} 
          onChange={(themeVariant) => onChange({ themeVariant })} 
        />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} placeholder="/products" onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
      </EditorSection>
    </div>
  );
}

export function SpecialOffersEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Text Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("leftImageSrc")} label="Left Image URL" value={props.leftImageSrc} onChange={(leftImageSrc) => onChange({ leftImageSrc })} />
        <MediaPickerField id={inputId("rightImageSrc")} label="Right Image URL" value={props.rightImageSrc} onChange={(rightImageSrc) => onChange({ rightImageSrc })} />
      </EditorSection>
    </div>
  );
}

export function ProductShowcaseEditor({ section, props, categories, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Data Source">
        <label className="block">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Category
          </span>
          <select
            id={inputId("showcaseCategoryId")}
            data-builder-input
            value={String(props.showcaseCategoryId || "all")}
            onChange={(event) => onChange({ showcaseCategoryId: event.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          >
            <option value="all">All Products</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </EditorSection>
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

export function HotDealsEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; deals?: any[] }>) {
  const deals = props.deals || [];
  const inputId = (field: string) => sectionInputId(section.id, field);

  const updateDeal = (index: number, patch: any) => {
    const updated = [...deals];
    updated[index] = { ...updated[index], ...patch };
    onChange({ deals: updated });
  };

  return (
    <div className="space-y-6">
      <EditorSection title="Header">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>

      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        Deal Cards (Exactly 4 Hot Deals)
      </div>
      {Array.from({ length: 4 }).map((_, index) => {
        const item = deals[index] || { name: "", originalPrice: "", salePrice: "", discount: "", image: "", endsIn: "" };
        const itemId = (field: string) => sectionInputId(section.id, `deal_${index}_${field}`);

        return (
          <div key={index} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
            <div className="text-xs font-black text-emerald-600 uppercase tracking-wide">
              Hot Deal Card #{index + 1}
            </div>
            <InputField
              id={itemId("name")}
              label="Product Name"
              value={item.name}
              onChange={(name) => updateDeal(index, { name })}
            />
            <MediaPickerField
              id={itemId("image")}
              label="Product Image"
              value={item.image}
              onChange={(image) => updateDeal(index, { image })}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id={itemId("salePrice")}
                label="Sale Price (e.g. ৳999)"
                value={item.salePrice}
                onChange={(salePrice) => updateDeal(index, { salePrice })}
              />
              <InputField
                id={itemId("originalPrice")}
                label="Original Price (e.g. ৳1,800)"
                value={item.originalPrice}
                onChange={(originalPrice) => updateDeal(index, { originalPrice })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                id={itemId("discount")}
                label="Discount Text (e.g. 45% OFF)"
                value={item.discount}
                onChange={(discount) => updateDeal(index, { discount })}
              />
              <InputField
                id={itemId("endsIn")}
                label="Ends In Timer (e.g. 2d 14h)"
                value={item.endsIn}
                onChange={(endsIn) => updateDeal(index, { endsIn })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ConsultationEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        <SegmentedControl id={inputId("imageAlign")} label="Layout" value={props.imageAlign || "right"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign })} />
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

export function NewArrivalsEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-4">
      <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
      <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <InputField id={inputId("ctaHref")} label="View All Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
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
