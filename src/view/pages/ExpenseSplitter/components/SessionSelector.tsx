import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Label } from '@/view/components/ui/label';
import { Separator } from '@/view/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { SplitSession } from '@/app/models/ExpenseSplitter';
import { SelectField } from '@/view/components/SelectField';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CURRENCIES = ['BRL', 'USD', 'EUR'];

interface SessionSelectorProps {
  sessions: SplitSession[];
  activeSessionId: string;
  activeSession: SplitSession;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
  onRename: (name: string) => void;
  onCurrencyChange: (currency: string) => void;
}

export function SessionSelector({
  sessions,
  activeSessionId,
  activeSession,
  onSwitch,
  onCreate,
  onDelete,
  onRename,
  onCurrencyChange,
}: SessionSelectorProps) {
  const { t } = useTranslation();
  const [newSplitName, setNewSplitName] = useState('');
  const hasMultipleSplits = sessions.length > 1;

  const handleCreate = () => {
    const name = newSplitName.trim() || t('expenseSplitter.newSplit');
    onCreate(name);
    setNewSplitName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenseSplitter.split')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {hasMultipleSplits && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="split-select">{t('expenseSplitter.switchSplit')}</Label>
            <SelectField
              id="split-select"
              value={activeSessionId}
              onChange={onSwitch}
              placeholder={t('expenseSplitter.switchSplit')}
              options={sessions.map((s) => ({ value: s.id, label: s.name }))}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="split-name">{t('expenseSplitter.splitName')}</Label>
          <Input
            id="split-name"
            placeholder={t('expenseSplitter.splitNamePlaceholder')}
            value={activeSession.name}
            onChange={(e) => onRename(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="currency">{t('expenseSplitter.currency')}</Label>
          <SelectField
            id="currency"
            value={activeSession.currency}
            onChange={onCurrencyChange}
            placeholder={t('expenseSplitter.currency')}
            options={CURRENCIES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        {hasMultipleSplits && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="self-start"
            onClick={() => onDelete(activeSessionId)}
          >
            <Trash2 className="size-4 mr-2" />
            {t('expenseSplitter.deleteSplit')}
          </Button>
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          <Label>{t('expenseSplitter.createSplit')}</Label>
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.createSplitHint')}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder={t('expenseSplitter.createSplitPlaceholder')}
              value={newSplitName}
              onChange={(e) => setNewSplitName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <Button type="button" variant="outline" onClick={handleCreate} className="shrink-0 sm:w-auto w-full">
              <Plus className="size-4 mr-1" />
              {t('expenseSplitter.addSplit')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
