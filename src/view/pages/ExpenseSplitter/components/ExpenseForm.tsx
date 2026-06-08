import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Checkbox } from '@/view/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { InputCurrency, parseCurrencyValue } from '@/view/components/InputCurrency';
import { SelectField } from '@/view/components/SelectField';
import { SplitParticipant } from '@/app/models/ExpenseSplitter';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

interface ExpenseFormProps {
  participants: SplitParticipant[];
  currency: string;
  onAdd: (expense: {
    description: string;
    amount: number;
    payerId: string;
    participantIds: string[];
  }) => void;
}

export function ExpenseForm({ participants, currency, onAdd }: ExpenseFormProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (participants.length > 0 && !payerId) {
      setPayerId(participants[0].id);
      setSelectedIds(participants.map((p) => p.id));
    }
    if (participants.length > 0) {
      setSelectedIds((prev) => {
        const valid = prev.filter((id) => participants.some((p) => p.id === id));
        return valid.length > 0 ? valid : participants.map((p) => p.id);
      });
      if (!participants.some((p) => p.id === payerId)) {
        setPayerId(participants[0].id);
      }
    }
  }, [participants, payerId]);

  const toggleParticipant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseCurrencyValue(amount);
    if (!description.trim() || isNaN(parsed) || parsed <= 0 || !payerId) return;
    if (selectedIds.length < 2 || !selectedIds.includes(payerId)) return;

    onAdd({
      description: description.trim(),
      amount: parsed,
      payerId,
      participantIds: selectedIds,
    });

    setDescription('');
    setAmount('');
  };

  if (participants.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('expenseSplitter.expenses')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.needTwoParticipants')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenseSplitter.addExpense')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="expense-description">{t('transactions.forms.description')}</Label>
            <Input
              id="expense-description"
              placeholder={t('transactions.forms.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('transactions.forms.amount')}</Label>
            <InputCurrency currency={currency} value={amount} onChange={setAmount} className="text-2xl" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="payer">{t('expenseSplitter.payer')}</Label>
            <SelectField
              id="payer"
              value={payerId}
              onChange={setPayerId}
              placeholder={t('expenseSplitter.payer')}
              options={participants.map((p) => ({ value: p.id, label: p.name }))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t('expenseSplitter.participantsInExpense')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {participants.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedIds.includes(p.id)}
                    onCheckedChange={() => toggleParticipant(p.id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit">{t('expenseSplitter.addExpense')}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
