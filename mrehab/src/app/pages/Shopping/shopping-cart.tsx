import React, { useEffect, useState } from "react";
import { CartItem } from "../../../components/BuyNow/ProductInfo";
import CartItemCard from "../../../components/Shopping/Cart/CartItemCard";
import pageStyles from "./shopping-cart.module.css";
import { Navbar } from "../../../components/Navbar";
import DeviceSelectionModal from "../../../components/Shopping/DeviceSelectionModal";

const CART_KEY = "mrehab_cart";

function getCartFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToLocalStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function ShoppingCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartFromLocalStorage());
  }, []);

  const handleUpdateItem = (index: number, updates: Partial<CartItem>) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      saveCartToLocalStorage(updated);
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      saveCartToLocalStorage(updated);
      return updated;
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
    <Navbar />
    <div className={pageStyles.page}>
      <div className={pageStyles.container}>
        <section className={pageStyles.itemsSection}>
          <h1 className={pageStyles.heading}>Your Cart</h1>

          {items.length === 0 ? (
            <p className={pageStyles.emptyMessage}>Your cart is empty.</p>
          ) : (
            items.map((item, index) => (
              <CartItemCard
                key={(item.product as any).id ?? `${item.product.name}-${index}`}
                item={item}
                onUpdate={(updates) => handleUpdateItem(index, updates)}
                onRemove={() => handleRemoveItem(index)}
              />
            ))
          )}
        </section>

        <aside className={pageStyles.summary}>
          <h2 className={pageStyles.summaryTitle}>Order Summary</h2>
          <div className={pageStyles.summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {/* Optional: tax, shipping, total */}
          <button
            type="button"
            className={pageStyles.checkoutButton}
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
    </>

  );
}
