import { httpClient } from "../httpClient";

type CurrenciesApiResponse = Array<Record<string, string>>;

export interface CurrencyOption {
  id: string;
  name: string;
}

const FALLBACK_CURRENCIES: CurrencyOption[] = [
  { id: 'BRL', name: 'BRL' },
  { id: 'USD', name: 'USD' },
  { id: 'EUR', name: 'EUR' },
  { id: 'GBP', name: 'GBP' },
  { id: 'CAD', name: 'CAD' },
];

export async function fetchCurrencies() {
  try {
    const { data } = await httpClient.get<CurrenciesApiResponse>('/plannings/currencies');

    const currencies = data.flatMap((item) => {
      const id = Object.keys(item)[0];
      const name = id ? item[id] : undefined;
      return id && name ? [{ id, name }] : [];
    });

    return currencies.length > 0 ? currencies : FALLBACK_CURRENCIES;
  } catch {
    return FALLBACK_CURRENCIES;
  }
}
