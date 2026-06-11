import { usePendingFirstTransaction } from '@/app/hooks/usePendingFirstTransaction';
import { useEffect, useRef, useState } from 'react';

export function useFirstTransactionPrompt() {
  const { isPending, clearPending } = usePendingFirstTransaction();
  const [dialogOpen, setDialogOpen] = useState(false);
  const didAutoOpen = useRef(false);

  useEffect(() => {
    if (!isPending) {
      didAutoOpen.current = false;
      return;
    }

    if (didAutoOpen.current) return;

    didAutoOpen.current = true;
    const timeout = window.setTimeout(() => setDialogOpen(true), 500);
    return () => window.clearTimeout(timeout);
  }, [isPending]);

  const handleSuccess = () => {
    clearPending();
    setDialogOpen(false);
  };

  return {
    isPending,
    dialogOpen,
    setDialogOpen,
    handleSuccess,
  };
}
