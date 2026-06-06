export interface Product {
  id: string;
  name: string;
  subName: string;
  price: string;
  originalPrice?: string;
  unit: string;
  description: string;
  details: string[];
  image: string;
  tags: string[];
  specs: { label: string; value: string }[];
}

export interface CareerOpportunity {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
}

export interface Review {
  id: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string[]; // Array of paragraphs for easy layout styling
  image: string;
  date: string;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  primaryKeywords: string[];
  secondaryKeywords: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  unit: string;
}

