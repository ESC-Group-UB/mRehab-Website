import React from "react";
import styles from "./StepCard.module.css";


type Props = {
  step?: number;
  title: string;
  description: string;
  iconPath?: string; // new!
  actionText?: string;
  onActionClick?: () => void;
};



export default function StepCard({
  title,
  description,
  iconPath,
  actionText,
  onActionClick,
}: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
            <img src={iconPath} alt={`icon`} className={styles.icon} />
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
      {actionText && onActionClick && (
        <button className={styles.actionBtn} onClick={onActionClick}>
          {actionText}  
        </button>
      )}
    </div>
  );
}
