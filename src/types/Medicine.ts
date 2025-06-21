// types/Medicine.ts
export interface Medicine {
  _id: string;
  name: string;
  expiryDate: string;
  quantity: number;
  email: string;
  imagePath?: string;
  pushSubscription?: any;
  createdAt?: string;
  updatedAt?: string;
}
