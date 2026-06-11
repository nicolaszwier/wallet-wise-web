import { Planning } from '@/app/models/Planning';
import { Avatar, AvatarFallback, AvatarImage } from '@/view/components/ui/avatar';
import { Button } from '@/view/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/view/components/ui/dropdown-menu';
import { Check, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlanningListItemProps {
  planning: Planning;
  isSelected: boolean;
  canDelete: boolean;
  onSelect: (planning: Planning) => void;
  onEdit: (planning: Planning) => void;
  onDelete: (planning: Planning) => void;
}

export function PlanningListItem({
  planning,
  isSelected,
  canDelete,
  onSelect,
  onEdit,
  onDelete,
}: PlanningListItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border-light bg-background-secondary p-2">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-background-tertiary"
        onClick={() => onSelect(planning)}
      >
        <Avatar className="h-9 w-9 shrink-0 rounded-lg">
          <AvatarImage alt={planning.description} />
          <AvatarFallback className="rounded-lg">{planning.description.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold">{planning.description}</span>
            {isSelected && <Check className="size-4 shrink-0 text-primary" aria-hidden />}
          </div>
          <span className="text-xs text-muted-foreground">{planning.currency}</span>
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label={t('selectPlanning.actions.menu')}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(planning)}>
            <Pencil className="size-4" />
            {t('selectPlanning.editPlanning')}
          </DropdownMenuItem>
          {canDelete && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(planning)}
            >
              <Trash2 className="size-4" />
              {t('selectPlanning.deletePlanning')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
