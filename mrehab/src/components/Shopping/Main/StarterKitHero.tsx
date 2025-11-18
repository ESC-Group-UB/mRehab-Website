import React, { FC } from "react";

export const StarterKitHero: FC = () => {
    
    const product_id = "00"; // replace with propper product id one day
    const redirect = `/shopping/info?id=${product_id}`
    const onClick = () => {
        window.location.href = redirect;
    }
   return (
    <div style={styles.wrapper}>
      
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <h2 style={styles.leftTitle}>mRehab Starter Kit</h2>

        <img 
          src="/images/product/product image 1.png" 
          alt="mRehab Starter Kit"
          style={styles.productImage}
        />
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <h1 style={styles.rightTitle}>All in one mRehab Experience</h1>

        <p style={styles.description}>
          Experience full recovery powered by our established mRehab Starter Kit. 
          Bundled with precision-fit 3D-printed tools and engaging AI-driven 
          guidance for home rehab success.
        </p>

        <button onClick={onClick} style={styles.buyButton}>
          Buy Now
        </button>
      </div>

    </div>
  );
};


type Style = React.CSSProperties;

const styles: Record<string, Style> = {
  wrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 80px",
    boxSizing: "border-box",
    gap: "60px",
  },

  /* LEFT SIDE */
  left: {
    flex: 1,
    textAlign: "center",
  },

  leftTitle: {
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: 500,
  },

  productImage: {
    width: "400px",
    height: "auto",
    objectFit: "contain",
  },

  /* RIGHT SIDE */
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0 20px",
  },

  rightTitle: {
    fontSize: "40px",
    marginBottom: "20px",
    fontWeight: 500,
  },

  description: {
    fontSize: "18px",
    lineHeight: "1.5",
    marginBottom: "40px",
    maxWidth: "550px",
  },

  buyButton: {
    backgroundColor: "#b10059",
    color: "white",
    padding: "18px 45px",
    fontSize: "24px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
  },
};
