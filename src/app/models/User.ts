import { Category } from "./Category";

export interface User {
  name: string;
  email: string;
  categories?: Category[],
  picture?: string
}
