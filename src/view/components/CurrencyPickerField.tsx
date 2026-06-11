"use client";

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { cn } from '@/app/utils/cn';
import { CurrencyOption } from '@/services/planningsService/fetchCurrencies';
import { Button } from '@/view/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/view/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/view/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger } from '@/view/components/ui/popover';
import { useTranslation } from 'react-i18next';

interface CurrencyPickerFieldProps {
  id?: string;
  value: string;
  currencies: CurrencyOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function formatCurrencyLabel(currency: CurrencyOption) {
  return `${currency.name} - ${currency.id}`;
}

function CurrencyPickerList({
  currencies,
  value,
  search,
  onSearchChange,
  onSelect,
  searchPlaceholder,
}: {
  currencies: CurrencyOption[];
  value: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (currencyId: string) => void;
  searchPlaceholder: string;
}) {
  const { t } = useTranslation();

  return (
    <Command
      shouldFilter={false}
      className="flex max-h-[min(400px,80vh)] flex-col overflow-hidden rounded-md bg-background"
    >
      <CommandInput
        placeholder={searchPlaceholder}
        value={search}
        onValueChange={onSearchChange}
      />
      <CommandList
        className="max-h-[min(320px,calc(80vh-3.5rem))] overflow-y-auto overscroll-contain"
        onWheel={(event) => event.stopPropagation()}
      >
        <CommandEmpty>{t('global.noResults')}</CommandEmpty>
        {currencies.map((currency) => (
          <CommandItem
            key={currency.id}
            value={currency.id}
            onSelect={() => onSelect(currency.id)}
          >
            <span className="truncate">{formatCurrencyLabel(currency)}</span>
            <Check
              className={cn(
                'ml-auto size-4 shrink-0',
                value === currency.id ? 'opacity-100' : 'opacity-0',
              )}
            />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}

export function CurrencyPickerField({
  id,
  value,
  currencies,
  onChange,
  placeholder = '',
  disabled,
}: CurrencyPickerFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const selected = currencies.find((currency) => currency.id === value);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  const filteredCurrencies = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return currencies;

    return currencies.filter((currency) => {
      const label = formatCurrencyLabel(currency).toLowerCase();
      return label.includes(query) || currency.id.toLowerCase().includes(query);
    });
  }, [currencies, search]);

  const handleSelect = (currencyId: string) => {
    onChange(currencyId);
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
      className="h-11 w-full justify-between bg-background-tertiary text-base font-normal"
    >
      <span className="truncate">
        {selected ? formatCurrencyLabel(selected) : placeholder}
      </span>
      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
    </Button>
  );

  const list = (
    <CurrencyPickerList
      currencies={filteredCurrencies}
      value={value}
      search={search}
      onSearchChange={setSearch}
      onSelect={handleSelect}
      searchPlaceholder={t('onboarding.step4.searchCurrency')}
    />
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <div className="flex max-h-[75vh] flex-col overflow-hidden px-2 pb-6 pt-2">
            {list}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[min(400px,calc(100vw-2rem))] p-0"
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {list}
      </PopoverContent>
    </Popover>
  );
}
