"use client";

import type { SectionEditorProps } from "./types";

type StringPatch = Record<string, unknown>;

function InputField({
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

function TextAreaField({
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

function SegmentedControl({
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
      </EditorSection>
      <EditorSection title="Call To Action">
        <InputField id={inputId("ctaText")} label="Button Text" value={props.ctaText} onChange={(ctaText) => onChange({ ctaText })} />
        <InputField id={inputId("ctaHref")} label="Button Link" value={props.ctaHref} placeholder="/products" onChange={(ctaHref) => onChange({ ctaHref })} />
      </EditorSection>
      <EditorSection title="Media">
        <InputField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} placeholder="https://..." onChange={(imageSrc) => onChange({ imageSrc })} />
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
        <InputField id={inputId("leftImageSrc")} label="Left Image URL" value={props.leftImageSrc} onChange={(leftImageSrc) => onChange({ leftImageSrc })} />
        <InputField id={inputId("rightImageSrc")} label="Right Image URL" value={props.rightImageSrc} onChange={(rightImageSrc) => onChange({ rightImageSrc })} />
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

export function TestimonialEditor({ section, props, onChange }: SectionEditorProps<StringPatch>) {
  const inputId = (field: string) => sectionInputId(section.id, field);
  return (
    <div className="space-y-4">
      <InputField id={inputId("title")} label="Title" value={props.title} onChange={(title) => onChange({ title })} />
      <InputField id={inputId("subtitle")} label="Subtitle" value={props.subtitle} onChange={(subtitle) => onChange({ subtitle })} />
      <SegmentedControl id={inputId("textAlign")} label="Header Alignment" value={props.textAlign || "center"} options={alignOptions} onChange={(textAlign) => onChange({ textAlign })} />
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
        <InputField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
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
        <InputField id={inputId("imageSrc")} label="Image URL" value={props.imageSrc} onChange={(imageSrc) => onChange({ imageSrc })} />
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
