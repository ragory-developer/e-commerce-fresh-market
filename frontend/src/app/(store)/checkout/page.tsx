"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/lib/config";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import * as fpixel from "@/lib/fpixel";

import AuthSelector from "@/components/checkout/AuthSelector";
import PhoneVerification from "@/components/checkout/PhoneVerification";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentSelector from "@/components/checkout/PaymentSelector";
import { useSettingsStore } from "@/store/settingsStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const { settings, fetchSettings, loading: settingsLoading } = useSettingsStore();
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [orderTotals, setOrderTotals] = useState({ 
    subtotal: getCartTotal(), 
    deliveryFee: 0, 
    discount: 0, 
    total: getCartTotal() 
  });
  const [calculatingTotals, setCalculatingTotals] = useState(false);

  // Checkout Steps State
  const [step, setStep] = useState(1);
  const [guestMode, setGuestMode] = useState(false);
  const [verifiedGuestUser, setVerifiedGuestUser] = useState<any>(null);
  
  // Order Formulation State
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchSettings();
    
    // Trigger InitiateCheckout
    if (items.length > 0) {
      fpixel.event('InitiateCheckout', {
        content_ids: items.map(i => i.id),
        content_type: 'product',
        value: getCartTotal(),
        currency: 'BDT',
        num_items: items.length
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine active user (registered or guest)
  const activeUser = isAuthenticated ? user : verifiedGuestUser;

  // Calculate generic order totals 
  const calculateTotals = async (addrToUse: any, couponToUse: string) => {
    if (!activeUser || items.length === 0) return;
    setCalculatingTotals(true);
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const payload = {
        items: items.map(i => ({ productId: i.productId || i.id, variantId: i.variantId, quantity: i.quantity, price: i.price })),
        deliveryAreaId: addrToUse?.areaId,
        deliveryCityId: addrToUse?.cityId,
        couponCode: couponToUse
      };
      
      const res = await fetch(`${API_URL}/api/orders/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setOrderTotals(data.data);
        if (couponToUse && data.data.discount > 0 && couponToUse !== appliedCoupon) {
          setAppliedCoupon(couponToUse); // Successfully applied new coupon
        }
      } else {
        if (couponToUse) {
          alert(data.message || "Invalid or expired coupon");
          if (couponToUse === couponCode) {
            setCouponCode(""); 
            setAppliedCoupon("");
            // Re-calculate without the bad coupon
            calculateTotals(addrToUse, "");
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCalculatingTotals(false);
    }
  };

  useEffect(() => {
    if (activeUser && items.length > 0) {
      calculateTotals(selectedAddress, appliedCoupon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedAddress, activeUser]);

  // Jump to Address step if already authenticated
  useEffect(() => {
    if (isAuthenticated && step === 1) {
      setStep(2);
    }
  }, [isAuthenticated, step]);

  const handleAuthSelect = (mode: 'guest' | 'login') => {
    if (mode === 'guest') {
      console.log('Guest checkout initiated. Verification setting:', settings.verify_number_before_order);
      // More robust check: Default to YES (verification) if setting is not specifically "false"
      // This covers cases where it is undefined, "true", or 1.
      if (settings.verify_number_before_order !== "false") {
        setGuestMode(true);
      } else {
        // Skip verification, go straight to address
        setVerifiedGuestUser({ isGuest: true });
        setStep(2);
      }
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  const submitOrder = async () => {
    if (!activeUser) return alert("Please verify your account first.");
    if (!selectedAddress) return alert("Please provide a delivery address.");
    
    setLoading(true);
    try {
      const token = localStorage.getItem('freshcart_access_token') || localStorage.getItem('token');
      const payload = {
        deliveryAddress: selectedAddress.address,
        deliveryCity: selectedAddress.city,
        deliveryCityId: selectedAddress.cityId,
        deliveryArea: selectedAddress.area,
        deliveryAreaId: selectedAddress.areaId,
        deliveryStateId: selectedAddress.stateId,
        paymentMethod,
        couponCode: appliedCoupon,
        notes: deliveryNote || undefined,
        customerName: selectedAddress.recipientName || activeUser.name,
        customerPhone: selectedAddress.recipientPhone || activeUser.phone,
        items: items.map(i => ({ productId: i.productId || i.id, variantId: i.variantId, quantity: i.quantity, price: i.price }))
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        clearCart();
        alert("Order placed successfully!");
        // If SSL or bKash, redirect to payment gateway URL returned in data.url
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          // If guest, redirect to success page instead of profile
          if (isAuthenticated) {
            router.push(`/profile/orders`);
          } else {
            router.push(`/order-success?orderId=${data.data.id}`);
          }
        }
      } else {
        alert(data.message || "Failed to submit order");
      }
    } catch (e) {
      alert("Network Error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Let's find some amazing products!</p>
        <Link href="/" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (settingsLoading && step === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-gray-500 font-medium">Initializing checkout...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 dark:bg-gray-950 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter italic">
            FRESHCART
          </Link>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
            <span className={step >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Account</span>
            <ChevronRight size={16} />
            <span className={step >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Shipping</span>
            <ChevronRight size={16} />
            <span className={step >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Payment</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Checkout Flow */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Step 1: Authentication (Only if not verified/logged in) */}
            {!activeUser && (
              !guestMode ? (
                <AuthSelector onSelect={handleAuthSelect} />
              ) : (
                <PhoneVerification 
                  onVerified={(u) => { setVerifiedGuestUser(u); }} 
                  onCancel={() => setGuestMode(false)} 
                />
              )
            )}

            {/* Main Checkout Sections (Visible once activeUser exists) */}
            {activeUser && (
              <div className="space-y-6">
                {/* 1. Address Section */}
                <AddressForm 
                  user={activeUser} 
                  onAddressSelect={(addr) => setSelectedAddress(addr)} 
                />

                {/* 2. Payment Section */}
                <PaymentSelector selected={paymentMethod} onSelect={setPaymentMethod} />

                {/* 3. Delivery Note */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-6">
                    Delivery Instructions
                  </h2>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Order Note <span className="font-normal text-gray-400 font-sans italic">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={deliveryNote}
                    onChange={e => setDeliveryNote(e.target.value)}
                    placeholder="Any special instructions, gate code, landmark, preferred delivery time..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-blue-500 text-sm resize-none transition-colors"
                  />
                </div>

                {/* 4. Action Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-8 bg-blue-50 dark:bg-blue-900/10 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 gap-6">
                  <div className="flex items-center gap-4 text-blue-800 dark:text-blue-300">
                    <div className="bg-white dark:bg-blue-900/50 p-3 rounded-2xl shadow-sm">
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <span className="font-black uppercase tracking-tight text-lg block leading-none">Secure Checkout</span>
                      <span className="text-xs font-bold opacity-70 uppercase tracking-widest mt-1 block">SSL Encrypted Transaction</span>
                    </div>
                  </div>
                  <button 
                    onClick={submitOrder}
                    disabled={loading || !selectedAddress}
                    className="w-full sm:w-auto px-12 py-5 bg-gray-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:translate-y-0"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : (
                      <>
                        <span>Place Order Now</span>
                        <ChevronRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}


          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-[400px] sticky top-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic mb-6">
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => {
                  const productUrl = settings.permalink_structure === 'product' ? `/product/${item.slug}` : `/${item.slug}`;
                  return (
                    <div key={item.id} className="flex gap-4 items-start">
                      <Link href={productUrl} className="w-16 h-16 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 overflow-hidden flex-shrink-0 relative cursor-pointer hover:opacity-80 transition-opacity">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`}
                            alt={item.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f0fdf4'/%3E%3Crect x='18' y='16' width='28' height='22' rx='2' fill='%23e2e8f0'/%3E%3Ccircle cx='32' cy='25' r='5' fill='%23cbd5e1'/%3E%3Cpolygon points='18,38 26,28 33,34 40,26 46,38' fill='%23cbd5e1'/%3E%3C/svg%3E"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <span className="text-gray-300 text-xs">No img</span>
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={productUrl}>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate hover:text-blue-600 transition-colors">
                            {item.name}
                          </h4>
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                          ৳{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                
                {/* Coupon Code Section - Always visible */}
                <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Coupon code" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 uppercase"
                    />
                    <button 
                      onClick={() => calculateTotals(selectedAddress, couponCode)}
                      disabled={calculatingTotals || !couponCode}
                      className="px-4 py-2 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>

                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>
                    {calculatingTotals ? <Loader2 className="animate-spin w-4 h-4 inline" /> : `৳${orderTotals.subtotal.toFixed(2)}`}
                  </span>
                </div>
                {orderTotals.discount > 0 && (
                  <div className="flex justify-between text-sm font-bold text-green-600 dark:text-green-400">
                    <span>Discount {appliedCoupon && `(${appliedCoupon})`}</span>
                    <span>-৳{orderTotals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span>
                    {calculatingTotals ? <Loader2 className="animate-spin w-4 h-4 inline" /> : (orderTotals.deliveryFee > 0 ? `৳${orderTotals.deliveryFee.toFixed(2)}` : 'Calculated next step')}
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <span className="text-lg font-black text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {calculatingTotals ? <Loader2 className="animate-spin w-6 h-6 inline" /> : `৳${orderTotals.total.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
