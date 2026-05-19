"use client";

import React from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";

interface EditableSectionProps {
  sectionId: string;
  index?: number;
  name: string;
  isActive: boolean;
  isEditing: boolean;
  onClick: (sectionId: string) => void;
  onDelete?: (sectionId: string) => void;
  children: React.ReactNode;
}

export default function EditableSection({
  sectionId,
  index = 0,
  name,
  isActive,
  isEditing,
  onClick,
  onDelete,
  children
}: EditableSectionProps) {
  const { isDragging, ref, handleRef } = useSortable({ id: sectionId, index, plugins: [] });

  if (!isEditing) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={ref}
      data-section-id={sectionId}
      className={`relative group transition-all duration-200 outline-dashed outline-2 outline-offset-[-2px] select-none ${
        isDragging
          ? "opacity-40 outline-emerald-400 bg-emerald-500/10 scale-[0.985] shadow-inner z-50 cursor-default"
          : isActive 
            ? "outline-emerald-500 z-40 bg-emerald-500/5 shadow-2xl cursor-pointer" 
            : "outline-transparent hover:outline-blue-400 hover:bg-blue-400/5 z-30 cursor-pointer"
      }`}
      onClickCapture={(e) => {
        const target = e.target as HTMLElement;
        // Prevent all link routing/navigating inside the canvas, except for top control bar actions
        if (!target.closest('.pointer-events-auto')) {
          e.preventDefault();
        }
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Active clicked field selector
        const target = e.target as HTMLElement;
        const fieldEl = target.closest('[data-field]') as HTMLElement | null;
        const field = fieldEl ? fieldEl.getAttribute('data-field') : null;
        
        onClick(sectionId);

        // Remove active element highlight from all elements
        document.querySelectorAll('.active-element-highlight').forEach(el => {
          el.classList.remove('active-element-highlight', 'outline-double', 'outline-2', 'outline-emerald-500', 'outline-offset-2', 'transition-all');
        });

        if (fieldEl) {
          // Highlight the clicked element
          fieldEl.classList.add('active-element-highlight', 'outline-double', 'outline-2', 'outline-emerald-500', 'outline-offset-2', 'transition-all');
        }
        
        if (field) {
          setTimeout(() => {
            const inputEl = document.getElementById(`input-${sectionId}-${field}`) as HTMLInputElement | HTMLTextAreaElement | null;
            if (inputEl) {
              inputEl.focus();
              inputEl.select();
              inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 80);
        }
      }}
    >
      {/* Integrated Premium Floating Top Control Bar */}
      <div 
        className={`absolute top-2 left-1/2 -translate-x-1/2 px-2 py-1.5 rounded-lg text-white text-xs font-bold flex max-w-[calc(100%-1rem)] items-center gap-2 transition-all duration-200 z-50 shadow-2xl border border-white/10 pointer-events-auto select-none ${
          isDragging
            ? "bg-emerald-600 opacity-100 scale-105"
            : isActive 
              ? "bg-emerald-500 opacity-100" 
              : "bg-gray-800 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible"
        }`}
      >
        {/* Reduced Grab Area: Grab indicator with name */}
        <div 
          ref={handleRef}
          className="flex min-w-0 items-center gap-1.5 cursor-grab active:cursor-grabbing px-2 py-0.5 hover:bg-white/10 rounded transition" 
          title="Click & hold to drag and reorder section"
        >
          <GripVertical size={13} className="shrink-0 text-white/80 animate-pulse" />
          <span className="truncate">{isDragging ? `Sorting ${name}` : name}</span>
        </div>

        {/* Divider & Remove Button */}
        {onDelete && (
          <>
            <div className="h-3 w-px shrink-0 bg-white/20" />
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(sectionId);
              }}
              className="p-1 rounded hover:bg-rose-600 active:scale-90 transition flex items-center justify-center text-white/90 hover:text-white"
              title="Delete Section"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>

      <div className="transition-all">
         {children}
      </div>
    </div>
  );
}
