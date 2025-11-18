export interface Product {
  id: string;
  name: string;
  price: number;
  image_paths: string[];
  description: string;
  details: string;
}

export const products: Product[] = [
  {
    id: "00",
    name: "mRehab Kit",
    price: 35.0,
    image_paths: [
      "/images/product/product image 1.png",
      "/images/product/product image 1.png",
      "/images/product/product image 1.png",
    ],
    description:
      "Our complete mRehab toolkit designed to support full at-home recovery with custom-fit rehab tools.",
    details:
      "Includes 2 custom-fit 3D-printed rehab tools, access to the mRehab mobile app, and a complete quickstart guide.",
  },

  {
    id: "01",
    name: "mRehab Mug",
    price: 19.99,
    image_paths: ["/images/product/mrehabmug.png"],
    description:
      "An ergonomic mug attachment designed to improve grip strength, stability, and wrist mobility.",
    details:
      "3D-printed for comfort and designed to pair with guided grip and rotation exercises inside the mRehab app.",
  },

  {
    id: "02",
    name: "mRehab Bowl",
    price: 24.99,
    image_paths: ["/images/product/Mrehabbowl.png"],
    description:
      "A stability-focused bowl used to support hand coordination and controlled movement practice.",
    details:
      "Lightweight 3D-printed design optimized for coordination exercises and functional daily movement training.",
  },

  {
    id: "03",
    name: "mRehab Key",
    price: 12.99,
    image_paths: ["/images/key.png"],
    description:
      "A precision rehab key tool perfect for practicing controlled rotation and fine-motor grip motion.",
    details:
      "Ideal for restoring finger dexterity, controlled twisting motions, and everyday functional movement accuracy.",
  },
];
