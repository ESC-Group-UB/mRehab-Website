import React, { FC, useRef } from "react";
import { Product } from "../Prodcuts";

interface Props {
  items: Product[];
}

export const ProductCarousel: FC<Props> = ({ items }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const navigateToProduct = (id: string) => {
    window.location.href = `/shopping/info?id=${id}`;
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.arrowButton} onClick={scrollLeft}>
        ‹
      </button>

      <div style={styles.carousel} ref={scrollRef}>
        {items.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => navigateToProduct(item.id)}
          >
            <div style={styles.imageWrapper}>
              <img
                src={item.image_paths[0]}
                alt={item.name}
                style={styles.image}
              />
            </div>
            <p style={styles.name}>{item.name}</p>
          </div>
        ))}
      </div>

      <button style={styles.arrowButton} onClick={scrollRight}>
        ›
      </button>
    </div>
  );
};

type Style = React.CSSProperties;

const styles: Record<string, Style> = {
  wrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 0",
  },

  arrowButton: {
    fontSize: "35px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    padding: "10px",
    userSelect: "none",
  },

  carousel: {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    gap: "30px",
    padding: "10px",
    scrollbarWidth: "none",
  } as React.CSSProperties,

   // 🔥 EACH CARD TAKES ⅓ OF SCREEN WIDTH
  card: {
    // flex: "0 0 calc((100vw - 120px) / 3)", 
    /*  
      100vw = full width
      -120px = gap compensation (3 gaps × 30px)
      /3 = exactly 3 cards visible  
    */
    flex: "0 0 calc((100vw - 120px) / 4)",
    background: "#efefef",
    borderRadius: "20px",
    padding: "20px",
    textAlign: "center",
    height: "380px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",                // 👈 makes card clickable
    transition: "transform 0.2s ease",
  },

  imageWrapper: {
    width: "100%",
    height: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },

  name: {
    fontSize: "20px",
    marginTop: "10px",
    fontWeight: 500,
  },
};
