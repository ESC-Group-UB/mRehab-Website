import React from "react";
import styles from "./ImageGallery.module.css";

type Props = {
  images: string[];
  selectedImage: string;
  setSelectedImage: (img: string) => void;
};

export default function ImageGallery({
  images,
  selectedImage,
  setSelectedImage,
}: Props) {
  return (
    <div className={styles.leftImages}>
      <div className={styles.thumbnailList}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={`${styles.thumbnail} ${
              selectedImage === img ? styles.active : ""
            }`}
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
      <img src={selectedImage} alt="Main Product" className={styles.mainImage} />
    </div>
  );
}
