import React from "react";
import { useEffect, useState } from "react";
import { products, Product } from "../../../components/Shopping/Prodcuts";
import { ShoppingTopBar } from "../../../components/Shopping/Main/TopBar";
import ImageGallery from "../../../components/BuyNow/ImageGallery";
import ProductInfo from "../../../components/BuyNow/ProductInfo";
import styles from "./featured.module.css";
import { Navbar } from "../../../components/Navbar";


export default function ProductInfoPage() {
    const [product, setProduct] = useState<Product>();
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    // Load product
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (id) {
            const found = products.find((p) => p.id === id);
            if (found) setProduct(found);
        }
    }, []);

    // When product loads → set images + selectedImage
    useEffect(() => {
        if (product) {
            setImages(product.image_paths);
            setSelectedImage(product.image_paths[0]); // default first image
        }
    }, [product]);

    return (
        <div>
            <Navbar/>
            <ShoppingTopBar></ShoppingTopBar>
            <main className={styles.buyContainer}>  
                <ImageGallery
                    images={images}
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                />
                {product ? <ProductInfo product={product} /> : null}
            </main>
            
        </div>
    );
}
