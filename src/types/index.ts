export interface Product {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string | React.ReactNode;
  timestamp: Date;
}
