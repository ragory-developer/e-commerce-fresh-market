"use client";

import type { SectionEditorProps } from "./types";

type StringPatch = Record<string, unknown>;

function InputField({
  label,
  value,
  placeholder,
  onChange,
}: {
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
        type="text"
        value={String(value || "")}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: {
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
        value={String(value || "")}
        placeholder={placeholder}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}

function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
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
      <div className="flex rounded-2xl border border-gray-200 bg-gray-100/80 p-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition ${
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
    <div className="space-y-4 border-b border-gray-100 pb-6 last:border-b-0">
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

export function HeroBannerEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl label="Text Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField label="Button Link" value={props.ctaHref} placeholder="/products" onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <InputField label="Image URL" value={props.imageSrc} placeholder="https://..." onChange={(imageSrc) => onChange({ imageSrc })} />
      </EditorSection>
    </div>
  );
}

export function SpecialOffersEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl label="Text Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <InputField label="Left Image URL" value={props.leftImageSrc} onChange={(leftImageSrc) => onChange({ leftImageSrc })} />
        <InputField label="Right Image URL" value={props.rightImageSrc} onChange={(rightImageSrc) => onChange({ rightImageSrc })} />
      </EditorSection>
    </div>
  );
}

export function ProductShowcaseEditor({ props, categories, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <SegmentedControl label="Header Alignment" value={props.textAlign || "left"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
      </EditorSection>
      <EditorSection title="Data Source">
        <label className="block">
          <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-gray-500">
            Category
          </span>
          <select
            value={String(props.showcaseCategoryId || "all")}
            onChange={(event) => onChange({ showcaseCategoryId: event.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
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

export function TestimonialEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-4">
      <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
      <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <SegmentedControl label="Header Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
    </div>
  );
}

export function ConsultationEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <InputField label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        <SegmentedControl label="Layout" value={props.imageAlign || "right"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign })} />
      </EditorSection>
    </div>
  );
}

export function RoutineEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-6">
      <EditorSection title="Content">
        <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
        <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
        <TextAreaField label="Description" value={props.description} onChange={(description) => onChange({ description })} />
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField label="Button Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <InputField label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
        <SegmentedControl label="Layout" value={props.imageAlign || "left"} options={imageAlignOptions} onChange={(imageAlign) => onChange({ imageAlign })} />
      </EditorSection>
    </div>
  );
}

export function NewArrivalsEditor({ props, onChange }: SectionEditorProps<StringPatch>) {
  return (
    <div className="space-y-4">
      <InputField label="Title" value={props.title} onChange={(title) => onChange({ title })} />
      <InputField label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <InputField label="View All Link" value={props.ctaHref} onChange={(ctaHref) => onChange({ ctaHref })} />
    </div>
  );
}

export function StaticSectionEditor() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center text-sm font-medium text-gray-500">
      This section uses dynamic storefront data and has no editable fields yet.
    </div>
  );
}
