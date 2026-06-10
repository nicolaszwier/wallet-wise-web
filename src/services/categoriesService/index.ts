import { Category, CategoryIconOption, CategorySource, CreateCategoryPayload, UpdateCategoryPayload } from '@/app/models/Category';
import { TransactionType } from '@/app/models/TransactionType';
import { httpClient } from '../httpClient';

interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  data?: T;
  error?: string | null;
}

export const categoriesService = {
  list,
  iconOptions,
  create,
  update,
  archive,
  remove,
};

async function list() {
  const { data } = await httpClient.get<ApiResponse<Category[]>>('/categories');
  return data.data ?? [];
}

async function iconOptions(type?: TransactionType) {
  const { data } = await httpClient.get<ApiResponse<CategoryIconOption[]>>('/categories/icon-options', {
    params: type ? { type } : undefined,
  });
  return data.data ?? [];
}

async function create(payload: CreateCategoryPayload) {
  const { data } = await httpClient.post<ApiResponse<Category>>('/categories', payload);
  return data.data;
}

async function update(categoryId: string, payload: UpdateCategoryPayload) {
  const { data } = await httpClient.put<ApiResponse<Category>>(`/categories/${categoryId}`, payload);
  return data.data;
}

async function archive(categoryId: string) {
  const { data } = await httpClient.patch<ApiResponse<Category>>(`/categories/${categoryId}/archive`);
  return data.data;
}

async function remove(categoryId: string) {
  await httpClient.delete(`/categories/${categoryId}`);
}

export type { CategorySource };
