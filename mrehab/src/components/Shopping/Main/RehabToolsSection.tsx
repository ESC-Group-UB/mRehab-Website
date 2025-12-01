import React, { FC } from "react";
import { ProductCarousel } from "./ProductCarousel";
import { Product } from "../../../components/Shopping/Prodcuts";

interface Props {
  items: Product[];
}

export const RehabToolsSection: FC<Props> = ({ items }) => {
  return (
    <div style={styles.wrapper}>

      {/* TITLE */}
      <h1 style={styles.title}>
        Rehab Created To improve <span style={styles.bold}>Your</span> Life
      </h1>

      {/* SUBTITLE */}
      <p style={styles.subtitle}>
        View our custom built tools that will help you <br />
        rebuild functional movement
      </p>

      {/* BORDERED BOX */}
      <div style={styles.box}>
        <ProductCarousel items={items} />
      </div>

    </div>
  );
};

type Style = React.CSSProperties;

const styles: Record<string, Style> = {
  wrapper: {
    width: "100%",
    padding: "60px 40px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  title: {
    fontSize: "36px",
    fontWeight: 500,
    marginBottom: "10px",
  },

  bold: {
    fontWeight: 700,
  },

  subtitle: {
    fontSize: "18px",
    color: "#444",
    marginBottom: "40px",
    lineHeight: "1.4",
  },

  box: {
    border: "3px solid black",
    borderRadius: "8px",
    padding: "30px",
    width: "100%",
    boxSizing: "border-box",
    marginTop: "20px",
  },
};
