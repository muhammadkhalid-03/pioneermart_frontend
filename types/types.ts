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
    is_favorite: boolean; // this is a separate field on the frontend for each user
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
  
export interface UserInfo{
    email: string;
    id: number;
}

export interface faqItem {
    id: number;
    question: string;
    answer: string;
}