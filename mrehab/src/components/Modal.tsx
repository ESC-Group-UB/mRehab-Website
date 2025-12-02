// src/components/common/Modal/Modal.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** Optional: disable closing when clicking backdrop */
  disableBackdropClose?: boolean;
  /** Optional: disable closing with Escape key */
  disableEscapeClose?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  disableBackdropClose,
  disableEscapeClose,
}) => {
  // Escape key to close
  useEffect(() => {
    if (!isOpen || disableEscapeClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, disableEscapeClose, onClose]);

  if (!isOpen) return null;

  // You can also create a div#modal-root in _document.html and render there if you want
  return ReactDOM.createPortal(
    <div
      className={styles.backdrop}
      onClick={() => {
        if (!disableBackdropClose) onClose();
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
