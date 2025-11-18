import React from "react";
import { useEffect, useState } from "react";
import { Navbar } from "../../../components/Navbar";
import {ShoppingTopBar} from "../../../components/Shopping/Main/TopBar";
import { StarterKitHero } from "../../../components/Shopping/Main/StarterKitHero";
import {RehabToolsSection} from "../../../components/Shopping/Main/RehabToolsSection";
import { Product, products } from "../../../components/Shopping/Prodcuts";



export default function ShoppingPage() {

    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        setItems(products);
    }, []);

    return (
        <>
        <Navbar></Navbar>
        <ShoppingTopBar></ShoppingTopBar>
        <StarterKitHero></StarterKitHero>
        <RehabToolsSection items={items}></RehabToolsSection>
        
        {/* shopping page top bar */}
        <div>

        </div>
        </>
    );
}