import React from "react";
import styles from "./ImageGallery.module.css";

type Props = {
  images: string[];
  selectedImage: string;
  setSelectedImage: (img: string) => void;
};

const isVideo = (src: string) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(src);

export default function ImageGallery({
  images,
  selectedImage,
  setSelectedImage,
}: Props) {
  return (
    <section className={styles.leftImages} aria-label="Product media gallery">
      <div className={styles.thumbnailList} role="listbox" aria-label="Thumbnails">
        {images.map((src, index) => {
          const active = selectedImage === src;
          const video = isVideo(src);
          return (
            <button
              key={index}
              type="button"
              role="option"
              aria-selected={active}
              aria-label={`Select ${video ? "video" : "image"} ${index + 1}`}
              className={`${styles.thumbButton} ${active ? styles.active : ""}`}
              onClick={() => setSelectedImage(src)}
            >
              {video ? (
                <div className={styles.videoThumbWrapper}>
                  <video
                    className={styles.thumbnail}
                    src={src}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    style={{ pointerEvents: "none" }}
                    // @ts-ignore (older iOS webviews)
                    webkit-playsinline="true"
                  />
                  <span className={styles.playBadge} aria-hidden="true">▶</span>
                </div>
              ) : (
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                  loading="lazy"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main viewer inside a fixed-ratio frame to prevent layout shift */}
      <div className={styles.mediaFrame}>
        {isVideo(selectedImage) ? (
          <video
            src={selectedImage}
            className={styles.mainMedia}
            controls
            playsInline
            preload="metadata"
            // @ts-ignore
            webkit-playsinline="true"
          />
        ) : (
          <img
            src={selectedImage}
            alt="Main Product"
            className={styles.mainMedia}
            loading="eager"
            decoding="async"
          />
        )}
      </div>
    </section>
  );
}
