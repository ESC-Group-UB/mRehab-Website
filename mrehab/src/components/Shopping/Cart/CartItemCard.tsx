import React, { FC, useState } from "react";
import { CartItem } from "../../BuyNow/ProductInfo";
import styles from "./CartItemCard.module.css";

interface CartItemCardProps {
  item: CartItem;
  onUpdate: (updates: Partial<CartItem>) => void;
  onRemove: () => void;
}

const CartItemCard: FC<CartItemCardProps> = ({ item, onUpdate, onRemove } ) => {
  // Local editing state for the "device" line (currently item.weight)
  const [isEditingDevice, setIsEditingDevice] = useState(false);
  const [deviceDraft, setDeviceDraft] = useState(item.weight);

  const handleQuantityChange = (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      onRemove();
    } else {
      onUpdate({ quantity: newQty });
    }
  };

  const handleDeviceSave = () => {
    onUpdate({ weight: deviceDraft }); // treat weight as device for now
    setIsEditingDevice(false);
  };

  const handleDeviceCancel = () => {
    setDeviceDraft(item.weight);
    setIsEditingDevice(false);
  };

  // Try to infer an image field; adjust this to your Product type
  const imageSrc =
    (item.product as any).imageUrl ||
    (item.product as any).image ||
    (item.product as any).thumbnail ||
    "";

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <h3 className={styles.title}>{item.product.name}</h3>

        <div className={styles.meta}>
          {/* Device row */}
          <div className={styles.row}>
            <span className={styles.label}>Device:</span>
            {isEditingDevice ? (
              <div className={styles.deviceEdit}>
                <input
                  className={styles.deviceInput}
                  value={deviceDraft}
                  onChange={(e) => setDeviceDraft(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.deviceAction}
                  onClick={handleDeviceSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className={styles.deviceActionSecondary}
                  onClick={handleDeviceCancel}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.deviceDisplay}>
                <span className={styles.value}>{item.weight}</span>
                <button
                  type="button"
                  className={styles.editIconButton}
                  onClick={() => setIsEditingDevice(true)}
                  aria-label="Edit device"
                >
                  ✏️
                </button>
              </div>
            )}
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

          {/* Optional: color */}
          {/* <div className={styles.row}>
            <span className={styles.label}>Color:</span>
            <span className={styles.value}>{item.color}</span>
          </div> */}
        </div>

        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.price}>${item.product.price.toFixed(2)}</div>
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
  );
};

export default CartItemCard;
