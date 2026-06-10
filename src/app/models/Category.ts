import { TransactionType } from "./TransactionType"

export type CategorySource = 'SEED' | 'CUSTOM';

export interface Category {
  id: string,
  userId: string,
  active: boolean,
  description: string,
  icon: string,
  type: TransactionType,
  source?: CategorySource,
  parentCategoryId?: string | null,
  customLabel?: string | null,
}

export interface CategoryIconOption {
  key: string;
  types: string[];
}

export interface CreateCategoryPayload {
  description: string;
  icon: string;
  type: TransactionType;
  parentCategoryId?: string | null;
  color?: string;
}

export interface UpdateCategoryPayload {
  description?: string;
  customLabel?: string | null;
  icon?: string;
}
