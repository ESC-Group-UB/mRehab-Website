import React, { useEffect, useState } from "react";
import { CartItem } from "../../../components/BuyNow/ProductInfo";
import CartItemCard from "../../../components/Shopping/Cart/CartItemCard";
import pageStyles from "./shopping-cart.module.css";
import { Navbar } from "../../../components/Navbar";
import Modal from "../../../components/Modal";

const CART_KEY = "mrehab_cart";
const API_URL = `${process.env.REACT_APP_BACKEND_API_URL}api/stripe/create-checkout-session`;

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

// ✅ JWT Decoder remains unchanged
function decodeJwtPayload(idToken: string): any | null {
  try {
    const payload = idToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    return JSON.parse(atob(base64 + pad));
  } catch {
    return null;
  }
}



function saveCartToLocalStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function ShoppingCartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  


  const checkoutClick = async () => {
    console.log("Checkout clicked");
    console.log("Items:", items);
    // check to ensure user is logged in
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setModalContent(
        <div>
          <h2>Login Required</h2>
          <p>Please log in to proceed to checkout.</p>
          <button onClick={() => {
            window.location.href = "/login";
            localStorage.setItem("redirectAfterLogin", "/shopping/cart");
          }}>Go to Login</button>
        </div>
      );
      setModal(true);
      return;
    }

    // check to ensure cart is not empty
    if (items.length === 0) {
      setModalContent(
        <div>
          <h2>Empty Cart</h2>
          <p>Your cart is empty.</p>
        </div>
      );
      setModal(true);
      return;
    }

    // check to ensure every item has a selected device
    for (const item of items) {
      console.log("Checking item:", item);
      if (item.device === null || item.device === undefined) {
        setModalContent(
          <div>
            <h2>Device Selection Required</h2>
            <p>Please select a device for the product: {item.product.name}</p>
          </div>
        );
        setModal(true);
        return;
      }
    }

    try {
      const idToken = localStorage.getItem("idToken")!;
      const user = decodeJwtPayload(idToken);


      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          items
        })
      });

      const data = await res.json();
      if (data?.url) window.location.assign(data.url);
      else throw new Error();
    } catch {
      console.error("Checkout failed. Try again.");
    }
  };

  useEffect(() => {
    setItems(getCartFromLocalStorage());
  }, []);

  const handleUpdateItem = (index: number, updates: Partial<CartItem>) => {
    setItems((prev) => {
      console.log("Updating item at index", index, "with", updates);
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
  {/* Device Modal */}
  <Modal isOpen={modal} onClose={() => setModal(false)} title="Attention">
    {modalContent}
  </Modal>

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
            onClick={checkoutClick}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
    </>

  );
}
