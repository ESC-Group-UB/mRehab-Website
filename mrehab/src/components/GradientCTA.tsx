import React from "react";
import styles from "./GradientCTA.module.css";

interface CallToActionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

const GradientCTA: React.FC<CallToActionProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {buttonText && buttonLink && (
        <a href={buttonLink} className={styles.button}>
          {buttonText}
        </a>
      )}
    </div>
  );
};

export default GradientCTA;
