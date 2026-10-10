export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export type Brand = Category;

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  quantity: number;
  sold: number;
  imageCover: string;
  images: string[];
  ratingsAverage: number;
  ratingsQuantity: number;
  category: Category;
  brand: Brand;
  subcategory: Subcategory[];
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: T[];
}

export type ProductSort = "featured" | "best-selling" | "top-rated" | "price-asc" | "price-desc" | "newest";

export interface ProductQuery {
  q?: string;
  category?: string;
  brand?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageCount: number;
}
