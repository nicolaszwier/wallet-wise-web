import { QueryClient } from '@tanstack/react-query';
import { Category } from '@/app/models/Category';
import { User } from '@/app/models/User';
import { categoriesService } from '@/services/categoriesService';

export async function refreshCategoriesCache(queryClient: QueryClient): Promise<Category[]> {
  const categories = await queryClient.fetchQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.list,
  });

  queryClient.setQueryData(['users', 'my-profile'], (old: User | undefined) => {
    if (!old) {
      return old;
    }

    return { ...old, categories };
  });

  return categories;
}
