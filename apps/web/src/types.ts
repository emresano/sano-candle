export type Collection = {
  id: number;
  slug: string;
  nameTr: string;
  nameEn: string;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
};

export type Product = {
  id: number;
  collectionId?: number | null;
  slug: string;
  nameTr: string;
  nameEn: string;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
  compositionTr?: string | null;
  compositionEn?: string | null;
  storyTr?: string | null;
  storyEn?: string | null;
  price: number;
  stock: number;
  imageUrl?: string | null;
  featured: number;
  images?: ProductImage[];
};

export type ProductImage = {
  id: number;
  productId: number;
  imageUrl: string;
  altText?: string | null;
  displayOrder: number;
};

export type CartItem = {
  id: number;
  quantity: number;
  product: Product;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: string;
  totalAmount: number;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  role: "customer" | "admin";
  fullName?: string | null;
};

