import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import FloatingMiniBasket from "@/components/layout/FloatingMiniBasket";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Slide-over Cart */}
      <CartDrawer />

      {/* Floating Mini Basket */}
      <FloatingMiniBasket />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      <Footer />
    </>
  );
}
