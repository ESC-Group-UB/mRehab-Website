import React, { FC } from "react";
import { CartItem } from "../../BuyNow/ProductInfo";
import CartItemCard from "./CartItemCard";
import styles from "./CartItemsSection.module.css";

interface CartItemsSectionProps {
  items: CartItem[];
  onUpdateItem: (index: number, updates: Partial<CartItem>) => void;
  onRemoveItem: (index: number) => void;
}

const CartItemsSection: FC<CartItemsSectionProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
}) => {
  return (
    <section className={styles.section} aria-label="Shopping cart items">
      <h2 className={styles.heading}>Items</h2>

      {items.length === 0 ? (
        <p className={styles.empty}>Your cart is empty.</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, index) => (
            <CartItemCard
              key={`${item.product.id}-${index}`}
              item={item}
              onUpdate={(updates) => onUpdateItem(index, updates)}
              onRemove={() => onRemoveItem(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CartItemsSection;
