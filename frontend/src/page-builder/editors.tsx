"use client";

import type { SectionEditorProps } from "./types";
import MediaLibraryModal from "@/components/admin/MediaLibraryModal";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type StringPatch = Record<string, unknown>;

// ─── Shared Editor Primitives ──────────────────────────────────────

export function InputField({
  id,
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  placeholder?: string;
  type?: "text" | "number" | "url";
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
        type={type}
        value={String(value ?? "")}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
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
  const url = String(value || "");

  return (
    <div className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      {url && (
        <div className="mb-2 relative group w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          data-builder-input
          type="text"
          value={url}
          placeholder="https://..."
          onChange={(e) => onChange(e.target.value)}
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
        onSelect={(_, url) => onChange(url)}
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
  rows = 3,
  onChange,
}: {
  id?: string;
  label: string;
  value?: unknown;
  placeholder?: string;
  rows?: number;
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
        value={String(value ?? "")}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

export function SelectField({
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
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <select
        id={id}
        data-builder-input
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
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

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: unknown;
  onChange: (value: string) => void;
}) {
  const color = String(value || "#000000");
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border border-gray-200 p-0.5"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>
    </label>
  );
}

// ─── Table Editor (add / remove / reorder array items) ─────────────

interface TableEditorProps<T extends Record<string, unknown>> {
  label: string;
  items: T[];
  maxItems?: number;
  defaultItem: T;
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  itemLabel?: (item: T, index: number) => string;
}

export function TableEditor<T extends Record<string, unknown>>({
  label,
  items,
  maxItems = 12,
  defaultItem,
  onChange,
  renderItem,
  itemLabel,
}: TableEditorProps<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(items.length > 0 ? 0 : null);

  const addItem = () => {
    if (items.length >= maxItems) return;
    const next = [...items, { ...defaultItem }];
    onChange(next);
    setExpandedIndex(next.length - 1);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
    if (expandedIndex === index) setExpandedIndex(null);
    else if (expandedIndex !== null && expandedIndex > index) setExpandedIndex(expandedIndex - 1);
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    setExpandedIndex(to);
  };

  const updateItem = (index: number, patch: Partial<T>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-gray-400">
          {label} ({items.length}{maxItems < 12 ? `/${maxItems}` : ""})
        </span>
        {items.length < maxItems && (
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-100"
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const isExpanded = expandedIndex === index;
          const title = itemLabel ? itemLabel(item, index) : `Item #${index + 1}`;

          return (
            <div
              key={index}
              className={`rounded-xl border transition ${
                isExpanded ? "border-emerald-300 bg-white shadow-sm" : "border-gray-200 bg-gray-50/50"
              }`}
            >
              <div
                className="flex cursor-pointer items-center gap-2 px-3 py-2.5"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                <GripVertical size={14} className="shrink-0 text-gray-300" />
                <span className="flex-1 truncate text-xs font-bold text-gray-700">{title}</span>

                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="rounded p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                    title="Remove"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 border-t border-gray-100 px-3 py-4">
                  {renderItem(item, index, (patch) => updateItem(index, patch))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
          <p className="text-xs font-semibold text-gray-400">No items yet. Click &ldquo;Add&rdquo; to get started.</p>
        </div>
      )}
    </div>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────

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

// ─── Gradient & Icon Options (shared) ──────────────────────────────

const gradientOptions = [
  { label: "Blue Gradient", value: "from-blue-500 to-blue-700" },
  { label: "Emerald Gradient", value: "from-emerald-500 to-teal-700" },
  { label: "Purple Gradient", value: "from-purple-500 to-indigo-700" },
  { label: "Rose Gradient", value: "from-rose-500 to-pink-700" },
  { label: "Gold Gradient", value: "from-amber-500 to-yellow-600" },
  { label: "Red Gradient", value: "from-red-600 to-orange-500" },
  { label: "Cyan Gradient", value: "from-cyan-500 to-blue-600" },
  { label: "Indigo Gradient", value: "from-indigo-500 to-purple-700" },
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
  { label: "Truck / Delivery", value: "Truck" },
  { label: "Shield / Guarantee", value: "ShieldCheck" },
  { label: "Clock / Timer", value: "Clock" },
  { label: "Tag / Label", value: "Tag" },
  { label: "Zap / Flash", value: "Zap" },
  { label: "Award / Badge", value: "Award" },
  { label: "Crown", value: "Crown" },
];

// ─── Section Editors ───────────────────────────────────────────────

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
            { label: "Puja", value: "puja" },
          ]}
          onChange={(themeVariant) => onChange({ themeVariant })}
        />
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
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Text Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Background">
        <SelectField
          id={inputId("bgColor")}
          label="Gradient Theme"
          value={String(props.bgColor || "from-blue-600 via-blue-700 to-indigo-800")}
          options={[
            { label: "Blue to Indigo", value: "from-blue-600 via-blue-700 to-indigo-800" },
            { label: "Emerald to Teal", value: "from-emerald-600 via-emerald-700 to-teal-800" },
            { label: "Rose to Pink", value: "from-rose-600 via-rose-700 to-pink-800" },
            { label: "Purple to Violet", value: "from-purple-600 via-purple-700 to-violet-800" },
            { label: "Amber to Orange", value: "from-amber-500 via-orange-600 to-red-700" },
          ]}
          onChange={(bgColor) => onChange({ bgColor })}
        />
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
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Data Source">
        <SelectField
          id={inputId("showcaseCategoryId")}
          label="Filter by Category"
          value={String(props.showcaseCategoryId || "all")}
          options={[
            { label: "All Products", value: "all" },
            ...categories.map((c) => ({ label: c.name, value: c.id })),
          ]}
          onChange={(showcaseCategoryId) => onChange({ showcaseCategoryId })}
        />
        <SegmentedControl
          id={inputId("showCategoryFilter")}
          label="Show Category Pills"
          value={props.showCategoryFilter === false ? "no" : "yes"}
          options={[
            { label: "Show", value: "yes" },
            { label: "Hide", value: "no" },
          ]}
          onChange={(v) => onChange({ showCategoryFilter: v === "yes" })}
        />
      </EditorSection>
    </div>
  );
}

export function PromoBadgeGridEditor({ section, props, onChange }: SectionEditorProps<{ badges?: any[] }>) {
  const badges = (props.badges || []) as Array<{
    title: string;
    subtitle: string;
    iconName: string;
    bgColor: string;
    href: string;
  }>;

  return (
    <div className="space-y-4">
      <TableEditor
        label="Promo Badge Cards"
        items={badges}
        maxItems={8}
        defaultItem={{ title: "New Offer", subtitle: "Details", iconName: "Gift", bgColor: "from-blue-500 to-blue-700", href: "/products" }}
        onChange={(updated) => onChange({ badges: updated })}
        itemLabel={(item) => item.title || "Untitled Badge"}
        renderItem={(item, _index, update) => (
          <>
            <InputField label="Title" value={item.title} onChange={(title) => update({ title })} />
            <InputField label="Subtitle" value={item.subtitle} onChange={(subtitle) => update({ subtitle })} />
            <InputField label="Link (href)" value={item.href} placeholder="/products?offer=..." onChange={(href) => update({ href })} />
            <SelectField
              label="Icon"
              value={item.iconName || "Gift"}
              options={iconOptions}
              onChange={(iconName) => update({ iconName })}
            />
            <SelectField
              label="Color Gradient"
              value={item.bgColor || "from-blue-500 to-blue-700"}
              options={gradientOptions}
              onChange={(bgColor) => update({ bgColor })}
            />
          </>
        )}
      />
    </div>
  );
}

export function TestimonialEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; textAlign?: string; testimonials?: any[] }>) {
  const testimonials = (props.testimonials || []) as Array<{
    name: string;
    avatar: string;
    rating: number;
    review: string;
    product: string;
  }>;
  const inputId = (field: string) => sectionInputId(section.id, field);

  return (
    <div className="space-y-6">
      <EditorSection title="Header">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>

      <TableEditor
        label="Testimonial Reviews"
        items={testimonials}
        maxItems={8}
        defaultItem={{ name: "", avatar: "", rating: 5, review: "", product: "" }}
        onChange={(updated) => onChange({ testimonials: updated })}
        itemLabel={(item) => item.name || "New Reviewer"}
        renderItem={(item, _index, update) => (
          <>
            <InputField label="Reviewer Name" value={item.name} onChange={(name) => update({ name })} />
            <MediaPickerField label="Avatar Image" value={item.avatar} onChange={(avatar) => update({ avatar })} />
            <InputField label="Product Reviewed" value={item.product} onChange={(product) => update({ product })} />
            <SelectField
              label="Rating"
              value={String(item.rating || 5)}
              options={[
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
                { label: "2 Stars", value: "2" },
                { label: "1 Star", value: "1" },
              ]}
              onChange={(v) => update({ rating: Number(v) })}
            />
            <TextAreaField label="Review Text" value={item.review} rows={3} onChange={(review) => update({ review })} />
          </>
        )}
      />
    </div>
  );
}

export function HotDealsEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; deals?: any[] }>) {
  const deals = (props.deals || []) as Array<{
    name: string;
    originalPrice: string;
    salePrice: string;
    discount: string;
    image: string;
    endsIn: string;
  }>;
  const inputId = (field: string) => sectionInputId(section.id, field);

  return (
    <div className="space-y-6">
      <EditorSection title="Header">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>

      <TableEditor
        label="Hot Deal Cards"
        items={deals}
        maxItems={8}
        defaultItem={{ name: "", originalPrice: "", salePrice: "", discount: "", image: "", endsIn: "" }}
        onChange={(updated) => onChange({ deals: updated })}
        itemLabel={(item) => item.name || "New Deal"}
        renderItem={(item, _index, update) => (
          <>
            <InputField label="Product Name" value={item.name} onChange={(name) => update({ name })} />
            <MediaPickerField label="Product Image" value={item.image} onChange={(image) => update({ image })} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Sale Price" placeholder="৳999" value={item.salePrice} onChange={(salePrice) => update({ salePrice })} />
              <InputField label="Original Price" placeholder="৳1,800" value={item.originalPrice} onChange={(originalPrice) => update({ originalPrice })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Discount Text" placeholder="45% OFF" value={item.discount} onChange={(discount) => update({ discount })} />
              <InputField label="Countdown" placeholder="2d 14h" value={item.endsIn} onChange={(endsIn) => update({ endsIn })} />
            </div>
          </>
        )}
      />
    </div>
  );
}

export function ConsultationEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  const features = (props.features || []) as string[];

  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>
      <EditorSection title="Feature List">
        <TableEditor
          label="Features"
          items={features.map((f) => ({ text: f }))}
          maxItems={6}
          defaultItem={{ text: "" }}
          onChange={(updated) => onChange({ features: updated.map((f) => f.text) })}
          itemLabel={(item) => item.text || "New feature"}
          renderItem={(item, _index, update) => (
            <InputField label="Feature text" value={item.text} placeholder="e.g. Personalized skin analysis" onChange={(text) => update({ text })} />
          )}
        />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <MediaPickerField id={inputId("imageSrc")} label="Banner Image" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
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
        <MediaPickerField id={inputId("imageSrc")} label="Banner Image" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        <SegmentedControl id={inputId("imageAlign")} label="Layout" value={props.imageAlign || "left"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign })} />
      </EditorSection>
    </div>
  );
}

export function NewArrivalsEditor({ section, props, onChange }: SectionEditorProps<{ title?: string; subtitle?: string; ctaHref?: string; items?: any[] }>) {
  const items = (props.items || []) as Array<{
    name: string;
    price: string;
    image: string;
    badge?: string;
  }>;
  const inputId = (field: string) => sectionInputId(section.id, field);

  return (
    <div className="space-y-6">
      <EditorSection title="Header">
        <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <InputField id={inputId("ctaHref")} label="View All Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>

      <TableEditor
        label="Arrival Items"
        items={items}
        maxItems={8}
        defaultItem={{ name: "", price: "", image: "", badge: "" }}
        onChange={(updated) => onChange({ items: updated })}
        itemLabel={(item) => item.name || "New Item"}
        renderItem={(item, _index, update) => (
          <>
            <InputField label="Product Name" value={item.name} onChange={(name) => update({ name })} />
            <MediaPickerField label="Product Image" value={item.image} onChange={(image) => update({ image })} />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Price" placeholder="৳2,450" value={item.price} onChange={(price) => update({ price })} />
              <InputField label="Badge" placeholder="New / Trending / Hot" value={item.badge || ""} onChange={(badge) => update({ badge })} />
            </div>
          </>
        )}
      />
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
