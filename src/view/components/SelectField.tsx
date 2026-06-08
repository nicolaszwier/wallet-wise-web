"use client";

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { cn } from '@/app/utils/cn';
import { Button } from '@/view/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/view/components/ui/popover';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/view/components/ui/drawer';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function OptionsList({
  options,
  value,
  onSelect,
}: {
  options: SelectOption[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <ul className="flex flex-col p-1">
      {options.map((option) => (
        <li key={option.value}>
          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-between rounded-md px-3 py-3 text-base text-left hover:bg-accent',
              value === option.value && 'bg-accent font-medium',
            )}
            onClick={() => onSelect(option.value)}
          >
            <span className="truncate">{option.label}</span>
            {value === option.value && <Check className="size-4 shrink-0" />}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function SelectField({
  id,
  value,
  options,
  onChange,
  placeholder = '',
  className,
  disabled,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const selected = options.find((option) => option.value === value);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  const trigger = (
    <Button
      id={id}
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={open}
      disabled={disabled}
      className={cn(
        'h-11 w-full justify-between bg-background-tertiary text-base font-normal',
        className,
      )}
    >
      <span className="truncate">{selected?.label ?? placeholder}</span>
      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">{placeholder || selected?.label}</DrawerTitle>
          <div className="max-h-[60vh] overflow-y-auto pb-6">
            <OptionsList options={options} value={value} onSelect={handleSelect} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <OptionsList options={options} value={value} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
