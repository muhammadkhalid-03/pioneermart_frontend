export interface ItemType {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  is_sold: boolean;
  created_at: string;
  category: number;
  category_name: string;
  seller: number;
  is_favorited: boolean; // this is a separate field on the frontend for each user
}

export interface CategoryType {
  id: number;
  name: string;
}

export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OtpScreenProps {
  email: string;
  otp: string;
}

export interface UserInfo {
  email: string;
  id: number;
  profile_picture: string;
}

export interface faqItem {
  id: number;
  question: string;
  answer: string;
}

export interface SingleItemProps {
  item: ItemType;
  showFavoritesIcon?: boolean;
}

export type ScreenId = "home" | "myItems" | "favorites";
