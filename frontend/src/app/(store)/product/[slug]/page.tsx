import ProductDetailPage, { generateMetadata as templateGenerateMetadata, generateStaticParams as templateGenerateStaticParams } from "@/components/product/ProductPageTemplate";

export async function generateMetadata(props: any) {
  return templateGenerateMetadata(props);
}

export async function generateStaticParams() {
  return templateGenerateStaticParams();
}

export default ProductDetailPage;
