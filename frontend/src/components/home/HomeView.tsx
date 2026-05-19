"use client";

import BuilderPageRenderer from "@/page-builder/BuilderPageRenderer";
import type { BuilderPageDocument } from "@/page-builder/types";

export default function HomeView({
  allProducts,
  document,
  dbComponents,
}: {
  allProducts: unknown[];
  document: BuilderPageDocument | null;
  dbComponents?: any[];
}) {
  return (
    <BuilderPageRenderer
      document={document}
      context={{ allProducts, dbComponents }}
      emptyFallback={
        <div className="flex min-h-screen flex-col items-center justify-center py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Welcome to Our Store</h1>
          <p className="text-gray-500">The home page is currently under construction. Please check back later.</p>
        </div>
      }
    />
  );
}
