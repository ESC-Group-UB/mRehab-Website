import React from "react";
import Header from "../../components/Header";
import './enroll.css';
import { useState, useEffect } from "react";

export default function Enroll() {

    const [imageSrc, setImageSrc] = useState("/icons/AI.png");

    useEffect(() => {
        const interval = setInterval(() => {
            cycleImage();
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


    const cycleImage = () => {
        const images = [
            "/icons/AI.png",
            "/icons/3dprint.png",
            "/icons/cloud.png"
        ];
        const currentIndex = images.indexOf(imageSrc);
        const nextIndex = (currentIndex + 1) % images.length;
        setImageSrc(images[nextIndex]);
    };

    const cycleImageLeft = () => {
        const images = [
            "/icons/AI.png",
            "/icons/3dprint.png",
            "/icons/cloud.png"
        ];
        const currentIndex = images.indexOf(imageSrc);
        const nextIndex = (currentIndex - 1 + images.length) % images.length;
        setImageSrc(images[nextIndex]);
    };

    return (
        <>
            <Header />
            <div className="enroll-main-container">
                <div className="left-panel">
                    <h1 className="product-title">mRehab Starter Kit</h1>
                    <img
                        src={imageSrc}
                        alt="mRehab Starter Kit"
                        className="product-image"
                    />
                </div>

                <div className="right-panel">
                    <div className="info-card">
                        <p className="price">$75</p>
                        <p className="sub-price">One-time payment</p>

                        <ul className="feature-list">
                            <li>2 custom 3D-printed recovery tools</li>
                            <li>1-year access to the mRehab mobile app</li>
                            <li>Daily progress tracking</li>
                            <li>Customized for your smartphone</li>
                            <li>Free U.S. shipping</li>
                        </ul>

                        <a href="https://buy.stripe.com/test_aFa4gyeH94Jy5rd1zZ2Nq00">
                            <button className="enroll-button">
                            Buy Now</button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
