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
    <div className={styles.leftImages}>
      <div className={styles.thumbnailList}>
        {images.map((src, index) => {
          const active = selectedImage === src;
          const video = isVideo(src);
          return (
            <button
              key={index}
              type="button"
              className={`${styles.thumbButton} ${active ? styles.active : ""}`}
              onClick={() => setSelectedImage(src)}
              aria-label={`Select ${video ? "video" : "image"} ${index + 1}`}
            >
              {video ? (
                <div className={styles.videoThumbWrapper}>
                  {/* No controls, no autoplay; pointer-events none ensures no accidental play */}
                  <video
                    className={styles.thumbnail}
                    src={src}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    style={{ pointerEvents: "none" }}
                    // @ts-ignore for older iOS webviews
                    webkit-playsinline="true"
                  />
                  <span className={styles.playBadge} aria-hidden="true">▶</span>
                </div>
              ) : (
                <img
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  className={styles.thumbnail}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main viewer: show video with controls only when selected */}
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
        />
      )}
    </div>
  );
}
