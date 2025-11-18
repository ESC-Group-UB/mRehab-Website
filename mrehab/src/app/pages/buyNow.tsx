import React, { useState } from "react";
import { Navbar } from "../../components/Navbar";
import ImageGallery from "../../components/BuyNow/ImageGallery";
// import ProductInfo from "../../components/BuyNow/ProductInfo";
import styles from "./BuyNow.module.css";

const images = [
  "/images/product/product image 1.png",
  "/images/product/Mrehabbowl.png",
  "/images/product/mrehabmug.png",
  "/images/product/mrehabVideo.mp4",
];
 
export function BuyNow() {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <>
      <Navbar />
      <main className={styles.buyContainer}>
        <ImageGallery
          images={images}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        {/* <ProductInfo /> */}
      </main>
    </>
  );
}
