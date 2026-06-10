import { CategoryIconOption } from '@/app/models/Category';
import { CategoryIcon } from '@/view/components/CategoryIcon';

interface CategoryIconPickerProps {
  icons: CategoryIconOption[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

export function CategoryIconPicker({ icons, selectedIcon, onSelect }: CategoryIconPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {icons.map((icon) => (
        <button
          key={icon.key}
          type="button"
          onClick={() => onSelect(icon.key)}
          className={`flex items-center justify-center rounded-xl border p-3 transition-colors ${
            selectedIcon === icon.key ? 'border-primary bg-primary/10' : 'border-border bg-background-tertiary'
          }`}
        >
          <CategoryIcon icon={icon.key} size={20} />
        </button>
      ))}
    </div>
  );
}
