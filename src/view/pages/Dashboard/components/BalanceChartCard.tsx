import { Balance } from "@/app/models/Balance";
import { getMonthFromDate } from "@/app/utils/date";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/view/components/ui/chart";
import { Separator } from "@/view/components/ui/separator";
import { Skeleton } from "@/view/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

interface CardProps {
  isLoading?: boolean;
  balance: Balance,
  currency: string
}


const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "var(--red)",
  },
  income: {
    label: "Income",
    color: "var(--green)",
  },

} satisfies ChartConfig

export function BalanceChartCard({balance, currency, isLoading}: CardProps) {
  const { t, i18n } = useTranslation()

  return (
      <div className="rounded-xl border bg-background-secondary text-back-foreground shadow md:col-span-4 lg:col-span-4">
        <div className="flex flex-col space-y-1.5 p-6">
          <h1 className="font-semibold leading-none tracking-tight">{t('dashboard.monthlyBalanceCard.title', {month: getMonthFromDate(new Date(), i18n.language)})}</h1>
        </div>
        <div className="p-6 pt-0 flex gap-8">
          {!isLoading && (
            <ChartContainer config={chartConfig} className="min-w-[140px] sm:min-w-[200px] md:min-w-[260px]">
              <BarChart accessibilityLayer data={[
                { type: t('global.expenses'), amount: Math.abs(balance?.expenses ?? 0), fill:"var(--color-expenses)" },
                { type: t('global.income'), amount: balance?.incomes ?? 0, fill:"var(--color-income)" },
              ]}>
                <CartesianGrid vertical={false}  stroke="var(--border)"/>
                <XAxis
                  dataKey="type"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="amount" fill="var(--color-desktop)" radius={8} />
              </BarChart>
            </ChartContainer>
          )}
          {isLoading && (
            <div className="min-w-[140px] sm:min-w-[200px] md:min-w-[260px] flex gap-7 p-3">
              <Skeleton className="w-[100px] h-[125px]"/>
              <Skeleton className="w-[100px] h-[125px]"/>
            </div>
          )}
          <div className="flex flex-col justify-center text-center w-full">
            <span className="tracking-tight text-sm font-medium text-muted-foreground">{t('global.expenses')}</span>
            {isLoading && <Skeleton className="h-6"/>}
            {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(Math.abs(balance?.expenses ?? 0), currency, i18n.language)}</span>}
            
            <span className="tracking-tight text-sm font-medium text-muted-foreground mt-3">{t('global.income')}</span>
            {isLoading && <Skeleton className="h-6"/>}
            {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(balance?.incomes ?? 0, currency, i18n.language)}</span>}          
            <Separator className="my-3" />

            <span className="tracking-tight text-sm font-medium text-muted-foreground">{t('global.balance')}</span>
            {isLoading && <Skeleton className="h-6"/>}
            {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(balance?.incomes ?? 0 - Math.abs(balance?.expenses ?? 0), currency, i18n.language)}</span>}
            
          </div>
        </div>
      </div>
  )
}