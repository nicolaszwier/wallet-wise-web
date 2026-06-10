import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categoriesService';
import { useAuth } from './useAuth';

export function useUserCategories() {
  const { signedIn, user } = useAuth();

  const query = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.list,
    enabled: signedIn,
    placeholderData: (previousData) => previousData ?? user?.categories,
  });

  return {
    categories: query.data ?? user?.categories ?? [],
    isLoading: query.isLoading,
  };
}
