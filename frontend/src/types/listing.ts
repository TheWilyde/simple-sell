export type Phase = "idle" | "analyzing" | "result";

export type ListingCategory =
  | "Electronics"
  | "Books"
  | "Clothing"
  | "Home"
  | "Tools"
  | "Furniture"
  | "other / miscellaneous";

export type Listing = {
  visual_analysis: string;
  title: string;
  description: string;
  category: ListingCategory;
  price: number;
};
