"use client";
import { API_URL } from "@/lib/config";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  SlidersHorizontal,
  Check,
  Loader2,
  X,
  Search,
} from "lucide-react";

const API = `${API_URL}/api/specifications`;

// ── Types ──────────────────────────────────────────────────────────────────

interface SpecificationValue {
  id: string;
  value: string;
  attributeId: string;
}

interface Specification {
  id: string;
  name: string;
  slug: string;
  values: SpecificationValue[];
}

export interface SimpleSpecification {
  name: string;             // specification name (for submission)
  value: string;            // pipe-separated selected values (for submission)
  _attributeId?: string;
  _selectedValueIds?: string[];
}

interface SpecificationTabWrapperProps {
  specifications: SimpleSpecification[];   // product's selected specifications
  onChange: (specifications: SimpleSpecification[]) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildValueLabel(spec: Specification, selectedIds: string[]): string {
  return spec.values
    .filter((v) => selectedIds.includes(v.id))
    .map((v) => v.value)
    .join(" | ");
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function SpecificationTabWrapper({
  specifications,
  onChange,
}: SpecificationTabWrapperProps) {
  // Global specification catalog
  const [catalog, setCatalog] = useState<Specification[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  // Which specification is "active" in the right panel
  const [activeSpecId, setActiveSpecId] = useState<string | null>(null);

  // Search filters
  const [specSearch, setSpecSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  // Create specification form
  const [newSpecName, setNewSpecName] = useState("");
  const [creatingSpec, setCreatingSpec] = useState(false);
  const [specError, setSpecError] = useState("");

  // Create value form
  const [newValueText, setNewValueText] = useState("");
  const [creatingValue, setCreatingValue] = useState(false);
  const [valueError, setValueError] = useState("");

  // ── Data loading ────────────────────────────────────────────────────────

  const fetchCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (json.success) {
        setCatalog(json.data);
        // Auto-activate first catalog specification if none set
        if (!activeSpecId && json.data.length > 0) {
          setActiveSpecId(json.data[0].id);
        }
      }
    } catch {
      console.error("Failed to load specifications");
    } finally {
      setLoadingCatalog(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // ── Derived state ───────────────────────────────────────────────────────

  const activeSpecification = catalog.find((a) => a.id === activeSpecId) ?? null;

  // Row in product's specification list for the active specification
  const activeRow = specifications.find((a) => a._attributeId === activeSpecId);
  const activeSelectedIds: string[] = activeRow?._selectedValueIds ?? [];

  // Specifications already added to the product
  const addedSpecIds = specifications.map((a) => a._attributeId).filter(Boolean);

  // Filtered lists
  const filteredCatalog = catalog.filter((a) =>
    a.name.toLowerCase().includes(specSearch.toLowerCase())
  );
  const filteredValues = (activeSpecification?.values ?? []).filter((v) =>
    v.value.toLowerCase().includes(valueSearch.toLowerCase())
  );

  // ── Specification actions ───────────────────────────────────────────────────

  // Toggle specification from catalog into/out of product list
  const toggleSpecificationInProduct = (spec: Specification) => {
    const already = specifications.find((a) => a._attributeId === spec.id);
    if (already) {
      // Remove from product
      onChange(specifications.filter((a) => a._attributeId !== spec.id));
    } else {
      // Add to product
      onChange([
        ...specifications,
        { name: spec.name, value: "", _attributeId: spec.id, _selectedValueIds: [] },
      ]);
    }
    setActiveSpecId(spec.id);
  };

  const handleCreateSpecification = async () => {
    const name = newSpecName.trim();
    if (!name) return;

    // Duplicate check (client-side)
    if (catalog.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      setSpecError("Specification already exists");
      return;
    }

    setCreatingSpec(true);
    setSpecError("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (json.success) {
        const created: Specification = json.data;
        setCatalog((prev) => [...prev, created]);
        setActiveSpecId(created.id);
        // Automatically add it to the product
        onChange([
          ...specifications,
          { name: created.name, value: "", _attributeId: created.id, _selectedValueIds: [] },
        ]);
        setNewSpecName("");
      } else {
        setSpecError(json.message || "Failed to create specification");
      }
    } catch {
      setSpecError("Network error");
    } finally {
      setCreatingSpec(false);
    }
  };

  const removeFromProduct = (specId: string) => {
    onChange(specifications.filter((a) => a._attributeId !== specId));
    if (activeSpecId === specId) {
      const remaining = specifications.filter((a) => a._attributeId !== specId);
      setActiveSpecId(remaining[0]?._attributeId ?? catalog[0]?.id ?? null);
    }
  };

  // ── Value actions ───────────────────────────────────────────────────────

  const toggleValue = (val: SpecificationValue) => {
    if (!activeSpecification) return;
    const isSelected = activeSelectedIds.includes(val.id);
    const newIds = isSelected
      ? activeSelectedIds.filter((id) => id !== val.id)
      : [...activeSelectedIds, val.id];

    const newLabel = buildValueLabel(activeSpecification, newIds);

    if (activeRow) {
      // Update existing row
      onChange(
        specifications.map((a) =>
          a._attributeId === activeSpecId
            ? { ...a, _selectedValueIds: newIds, value: newLabel }
            : a
        )
      );
    } else {
      // Specification is in catalog but not yet added to product — add it now
      onChange([
        ...specifications,
        {
          name: activeSpecification.name,
          value: newLabel,
          _attributeId: activeSpecId!,
          _selectedValueIds: newIds,
        },
      ]);
    }
  };

  const handleCreateValue = async () => {
    const val = newValueText.trim();
    if (!val || !activeSpecId) return;

    // Duplicate check
    if (
      activeSpecification?.values.some(
        (v) => v.value.toLowerCase() === val.toLowerCase()
      )
    ) {
      setValueError("Value already exists");
      return;
    }

    setCreatingValue(true);
    setValueError("");
    try {
      const res = await fetch(`${API}/${activeSpecId}/values`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val }),
      });
      const json = await res.json();
      if (json.success) {
        const created: SpecificationValue = json.data;

        // Update catalog
        setCatalog((prev) =>
          prev.map((a) =>
            a.id === activeSpecId
              ? { ...a, values: [...a.values, created] }
              : a
          )
        );

        // Auto-select the new value in the product row
        const newIds = [...activeSelectedIds, created.id];
        const updatedSpec = {
          ...activeSpecification!,
          values: [...(activeSpecification?.values ?? []), created],
        };
        const newLabel = buildValueLabel(updatedSpec, newIds);

        if (activeRow) {
          onChange(
            specifications.map((a) =>
              a._attributeId === activeSpecId
                ? { ...a, _selectedValueIds: newIds, value: newLabel }
                : a
            )
          );
        } else {
          onChange([
            ...specifications,
            {
              name: activeSpecification!.name,
              value: newLabel,
              _attributeId: activeSpecId!,
              _selectedValueIds: newIds,
            },
          ]);
        }

        setNewValueText("");
      } else {
        setValueError(json.message || "Failed to create value");
      }
    } catch {
      setValueError("Network error");
    } finally {
      setCreatingValue(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Product Specifications
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Select specifications and their values. You can also create new ones
          directly from here.
        </p>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 flex min-h-[420px]">

        {/* ── LEFT: Specification list ── */}
        <div className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Specifications
            </p>
          </div>

          {/* Specification search */}
          <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={specSearch}
                onChange={(e) => setSpecSearch(e.target.value)}
                placeholder="Search specs…"
                className="w-full pl-6 pr-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              {specSearch && (
                <button
                  onClick={() => setSpecSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loadingCatalog ? (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading…
              </div>
            ) : filteredCatalog.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8 px-3">
                {specSearch ? `No results for "${specSearch}"` : "No specifications yet. Create one below."}
              </p>
            ) : (
              filteredCatalog.map((spec) => {
                const isActive = spec.id === activeSpecId;
                const isAdded = addedSpecIds.includes(spec.id);
                return (
                  <button
                    key={spec.id}
                    onClick={() => setActiveSpecId(spec.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left transition-colors ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 font-semibold border-l-2 border-blue-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-transparent"
                    }`}
                  >
                    {/* Checkbox for product inclusion */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSpecificationInProduct(spec);
                      }}
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isAdded
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700"
                      }`}
                    >
                      {isAdded && <Check size={10} className="text-white" />}
                    </span>
                    <span className="truncate flex-1">{spec.name}</span>
                  </button>
                );
              })
            )}
          </div>

          {/* Create specification */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newSpecName}
                onChange={(e) => {
                  setNewSpecName(e.target.value);
                  setSpecError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateSpecification();
                  }
                }}
                placeholder="New specification…"
                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button
                onClick={handleCreateSpecification}
                disabled={!newSpecName.trim() || creatingSpec}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors"
                title="Create specification"
              >
                {creatingSpec ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Plus size={12} />
                )}
              </button>
            </div>
            {specError && (
              <p className="text-[11px] text-red-500 mt-1">{specError}</p>
            )}
          </div>
        </div>

        {/* ── RIGHT: Values panel ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeSpecification ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
              <SlidersHorizontal size={36} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">
                Select a specification on the left
              </p>
              <p className="text-xs mt-1">
                to view and manage its values
              </p>
            </div>
          ) : (
            <>
              {/* Values header */}
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Values for
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {activeSpecification.name}
                  </p>
                </div>
                {/* Toggle add/remove from product */}
                <button
                  onClick={() => toggleSpecificationInProduct(activeSpecification)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    addedSpecIds.includes(activeSpecification.id)
                      ? "border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  {addedSpecIds.includes(activeSpecification.id)
                    ? "Remove from product"
                    : "Add to product"}
                </button>
              </div>

              {/* Value search */}
              {activeSpecification.values.length > 0 && (
                <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <div className="relative max-w-sm">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={valueSearch}
                      onChange={(e) => setValueSearch(e.target.value)}
                      placeholder="Search values…"
                      className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                    {valueSearch && (
                      <button
                        onClick={() => setValueSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Value chips */}
              <div className="flex-1 overflow-y-auto p-5">
                {activeSpecification.values.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No values yet — create one below.
                  </p>
                ) : filteredValues.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    No values match &ldquo;{valueSearch}&rdquo;
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filteredValues.map((val) => {
                      const isSelected = activeSelectedIds.includes(val.id);
                      return (
                        <button
                          key={val.id}
                          onClick={() => toggleValue(val)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-none"
                              : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                          {val.value}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Selected summary */}
                {activeSelectedIds.length > 0 && (
                  <div className="mt-4 text-xs text-gray-500">
                    Selected:{" "}
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">
                      {activeRow?.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Create value */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newValueText}
                    onChange={(e) => {
                      setNewValueText(e.target.value);
                      setValueError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateValue();
                      }
                    }}
                    placeholder={`Add new value for "${activeSpecification.name}"…`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  <button
                    onClick={handleCreateValue}
                    disabled={!newValueText.trim() || creatingValue}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-40 transition-colors"
                  >
                    {creatingValue ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Plus size={14} />
                    )}
                    Add Value
                  </button>
                </div>
                {valueError && (
                  <p className="text-xs text-red-500 mt-1.5">{valueError}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Added specifications summary ── */}
      {specifications.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Added to this product
          </p>
          <div className="space-y-2">
            {specifications.map((spec, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {spec.name}
                  </p>
                  {spec.value ? (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {spec.value.split(" | ").map((v) => (
                        <span
                          key={v}
                          className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-700/50"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-0.5 italic">
                      No values selected
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromProduct(spec._attributeId!)}
                  className="shrink-0 mt-0.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
