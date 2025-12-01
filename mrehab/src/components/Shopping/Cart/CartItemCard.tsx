import React, { FC, useState } from "react";
import { CartItem } from "../../BuyNow/ProductInfo";
import {FiEdit3  } from "react-icons/fi";

import DeviceSelectionModal, {
  DeviceSelectionResult,
} from "../DeviceSelectionModal";
import styles from "./CartItemCard.module.css";

interface CartItemCardProps {
  item: CartItem;
  onUpdate: (updates: Partial<CartItem>) => void;
  onRemove: () => void;

}

const CodepenIcon = FiEdit3  as unknown as React.FC;


const   CartItemCard: FC<CartItemCardProps> = ({ item, onUpdate, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      return;
    } else {
      onUpdate({ quantity: newQty });
    }
  };

  const handleDeviceConfirm = (result: DeviceSelectionResult) => {
    const deviceLabel = `${result.brand} ${result.deviceModel}`;
    // still storing device in `weight` for now
    onUpdate({ device: deviceLabel });
    setIsModalOpen(false);
  };

  const imageSrc =
    (item.product as any).imageUrl ||
    (item.product as any).image ||
    (item.product as any).thumbnail ||
    "";

  return (
    <>
      <article className={styles.card}>
        <div className={styles.left}>
          {/* Title */}
          
          <h3 onClick={() => { window.location.href = `/shopping/info?id=${item.product.id}`; }} className={styles.title}>{item.product.name}</h3>

          {/* Meta info */}
          <div className={styles.meta}>
            {/* Device row */}
            <div className={styles.row}>
              <span className={styles.label}>Device:</span>
              <div className={styles.deviceDisplay}>
                <span className={styles.value}>
                  {item.device || "Not set"}
                </span>
                <button
                  type="button"
                  className={styles.editIconButton}
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Edit device"
                >
                  <CodepenIcon />
                </button>
              </div>
            </div>

            {/* Color row (optional) */}
            <div className={styles.row}>
              <span className={styles.label}>Color:</span>
              <span className={styles.value}>{item.color || "—"}</span>
            </div>
            {/* Color row (optional) */}
            <div className={styles.row}>
              <span className={styles.label}>Weight:</span>
              <span className={styles.value}>{item.weight || "—"}</span>
            </div>

            {/* Quantity row */}
            <div className={styles.row}>
              <span className={styles.label}>Quantity:</span>
              <div className={styles.qtyControls}>
                <button
                  type="button"
                  className={styles.qtyButton}
                  onClick={() => handleQuantityChange(-1)}
                >
                  –
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                  type="button"
                  className={styles.qtyButton}
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Remove button */}
          <button
            type="button"
            className={styles.removeButton}
            onClick={onRemove}
          >
            Remove
          </button>
        </div>

        {/* Right side: price + image */}
        <div className={styles.right}>
          <div className={styles.price}>
            ${item.product.price.toFixed(2)}
          </div>

          {imageSrc && (
            <div className={styles.imageWrapper}>
              <img
                src={imageSrc}
                alt={item.product.name}
                className={styles.image}
              />
            </div>
          )}
        </div>
      </article>

      {/* Device selection modal */}
      <DeviceSelectionModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDeviceConfirm}
      />
    </>
  );
};

export default CartItemCard;
