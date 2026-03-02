export type ProductCondition = "new" | "like-new" | "good" | "fair";
export type ProductStatus = "available" | "sold";

export interface Product {
  $id: string;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  category: string;
  images: string[];
  seller_name: string;
  seller_phone: string;
  location: string;
  status: ProductStatus;
  edit_code: string;
  $createdAt: string;
  reported?: boolean;
}

export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports",
  "Home & Garden",
  "Toys",
  "Other",
];

export const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];
