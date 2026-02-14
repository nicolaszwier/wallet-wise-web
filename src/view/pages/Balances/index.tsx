import { Button } from "@/view/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/view/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useBalancesController } from "./useBalancesController";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/view/components/ui/chart";
import { Bar, BarChart } from "recharts";
import { CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/view/components/ui/skeleton";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { Separator } from "@/view/components/ui/separator";
import { usePlanning } from "@/app/hooks/usePlanning";
import { CategoryIcon } from "@/view/components/CategoryIcon";
import { TransactionType } from "@/app/models/TransactionType";
import { BalanceCategory } from "@/app/models/Balance";
import { cn } from "@/app/utils/cn";

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "var(--red)",
  },
  income: {
    label: "Income",
    color: "var(--green)",
  },
} satisfies ChartConfig;

function CategoryBalanceItem({
  category,
  currency,
  locale,
}: {
  category: BalanceCategory;
  currency: string;
  locale: string;
}) {
  const isExpense = category.type === TransactionType.EXPENSE;
  const amount = isExpense ? Math.abs(category.balance) : category.balance;
  return (
    <div className="flex items-start gap-3 py-2">
      <CategoryIcon icon={category.icon} size={20} />
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium truncate">{category.description}</span>
        <span
          className={cn(
            "text-sm font-semibold",
            isExpense ? "text-red" : "text-green"
          )}
        >
          {formatCurrency(amount, currency, locale)}
        </span>
      </div>
    </div>
  );
}

export default function Balances() {
  const { t, i18n } = useTranslation();
  const { selectedPlanning } = usePlanning();
  const { formattedMonthYear, goToPreviousMonth, goToNextMonth, isLoading, balance } = useBalancesController();

  const expenseCategories = balance?.categories?.filter((c) => c.type === TransactionType.EXPENSE) ?? [];
  const incomeCategories = balance?.categories?.filter((c) => c.type === TransactionType.INCOME) ?? [];

  return (
    <div className="h-full relative">
      <div className="justify-center flex items-center w-full flex-col">
        <Tabs defaultValue="monthly" className="w-full max-w-2xl p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">
              {t("balances.tabs.monthlyBalance")}
            </TabsTrigger>
            <TabsTrigger value="byCategory">
              {t("balances.tabs.balanceByCategory")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="mt-4">
            <div className="flex justify-center items-center bg-background gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft />
              </Button>
              <p className="font-semibold text-sm"><span>{formattedMonthYear}</span></p>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight />
              </Button>
            </div>

            <div className="p-6 pt-0 flex gap-8">
              {!isLoading && balance && selectedPlanning?.currency && (
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
                  <Skeleton className="w-[75px] sm:w-[100px] h-[125px]"/>
                  <Skeleton className="w-[75px] sm:w-[100px] h-[125px]"/>
                </div>
              )}
              <div className="flex flex-col justify-center text-center w-full">
                <span className="tracking-tight text-sm font-medium text-muted-foreground">{t('global.expenses')}</span>
                {isLoading && <Skeleton className="h-6"/>}
                {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(Math.abs(balance?.expenses ?? 0), selectedPlanning?.currency ?? '', i18n.language)}</span>}
                
                <span className="tracking-tight text-sm font-medium text-muted-foreground mt-3">{t('global.income')}</span>
                {isLoading && <Skeleton className="h-6"/>}
                {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(balance?.incomes ?? 0, selectedPlanning?.currency ?? '', i18n.language)}</span>}          
                <Separator className="my-3" />

                <span className="tracking-tight text-sm font-medium text-muted-foreground">{t('global.balance')}</span>
                {isLoading && <Skeleton className="h-6"/>}
                {!isLoading && <span className="tracking-tight font-semibold">{formatCurrency(balance?.incomes ?? 0 - Math.abs(balance?.expenses ?? 0), selectedPlanning?.currency ?? '', i18n.language)}</span>}
                
              </div>
            </div>

            {!isLoading && balance?.categories && balance.categories.length > 0 && selectedPlanning?.currency && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6 pb-6">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t("global.expenses")}</h3>
                  <ul className="space-y-0">
                    {expenseCategories.map((category) => (
                      <li key={category.categoryId}>
                        <CategoryBalanceItem
                          category={category}
                          currency={selectedPlanning.currency}
                          locale={i18n.language}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t("global.income")}</h3>
                  <ul className="space-y-0">
                    {incomeCategories.map((category) => (
                      <li key={category.categoryId}>
                        <CategoryBalanceItem
                          category={category}
                          currency={selectedPlanning.currency}
                          locale={i18n.language}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </TabsContent>
          <TabsContent value="byCategory" className="mt-4">
            <div className="flex justify-center items-center bg-background gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft />
              </Button>
              <p className="font-semibold text-sm"><span>{formattedMonthYear}</span></p>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
