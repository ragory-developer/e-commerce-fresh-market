import HeroBanner from "../HeroBanner";
import PromoBadgeGrid from "../PromoBadgeGrid";
import SpecialOffersBanner from "../SpecialOffersBanner";
import ConsultationBanner from "../ConsultationBanner";
import ProductShowcase from "../ProductShowcase";
import RoutineBanner from "../RoutineBanner";
import TestimonialSection from "../TestimonialSection";
import NewArrivalsSection from "../NewArrivalsSection";
import HotDealsSection from "../HotDealsSection";
import EditableSection from "../../admin/HomeBuilder/wrappers/EditableSection";

export default function HomeTemplate1({ 
  allProducts, 
  data,
  isEditing = false,
  activeSection,
  onSectionClick
}: { 
  allProducts: any[], 
  data?: any,
  isEditing?: boolean,
  activeSection?: string,
  onSectionClick?: (section: string) => void
}) {
  // If data is provided, use it, otherwise fallback to empty object
  const heroData = data?.hero || {};
  const specialOffersData = data?.specialOffers || {};
  
  // Filter products if showcaseCategoryId is set and not "all"
  let showcaseProducts = allProducts;
  if (data?.showcaseCategoryId && data.showcaseCategoryId !== "all") {
    showcaseProducts = allProducts.filter(p => p.categoryId === data.showcaseCategoryId || p.category?.id === data.showcaseCategoryId);
  }

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) onSectionClick(sectionId);
  };

  return (
    <>
      <EditableSection sectionId="hero" name="Hero Banner" isEditing={isEditing} isActive={activeSection === "hero"} onClick={handleSectionClick}>
        <HeroBanner {...heroData} />
      </EditableSection>

      <PromoBadgeGrid />

      <EditableSection sectionId="specialOffers" name="Special Offers" isEditing={isEditing} isActive={activeSection === "specialOffers"} onClick={handleSectionClick}>
        <SpecialOffersBanner {...specialOffersData} />
      </EditableSection>
      
      <ConsultationBanner />
      
      <EditableSection sectionId="productShowcase" name="Product Showcase" isEditing={isEditing} isActive={activeSection === "productShowcase"} onClick={handleSectionClick}>
        <ProductShowcase products={showcaseProducts} />
      </EditableSection>
      
      <RoutineBanner />
      <TestimonialSection />
      <NewArrivalsSection />
      <HotDealsSection />
    </>
  );
}
