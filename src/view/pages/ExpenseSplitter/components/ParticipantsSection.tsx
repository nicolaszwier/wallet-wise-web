import { Button } from '@/view/components/ui/button';
import { Input } from '@/view/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Badge } from '@/view/components/ui/badge';
import { SplitParticipant } from '@/app/models/ExpenseSplitter';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface ParticipantsSectionProps {
  participants: SplitParticipant[];
  currentUserEmail?: string;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  isPayer: (id: string) => boolean;
}

export function ParticipantsSection({
  participants,
  currentUserEmail,
  onAdd,
  onRemove,
  isPayer,
}: ParticipantsSectionProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name);
    setName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('expenseSplitter.participants')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder={t('expenseSplitter.addParticipantPlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button type="button" variant="outline" onClick={handleAdd}>
            <Plus className="size-4" />
          </Button>
        </div>

        {participants.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('expenseSplitter.emptyParticipants')}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{p.name}</span>
                  {currentUserEmail && p.linkedUserId === currentUserEmail && (
                    <Badge variant="secondary">{t('expenseSplitter.participant.you')}</Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isPayer(p.id)}
                  onClick={() => onRemove(p.id)}
                  title={isPayer(p.id) ? t('expenseSplitter.cannotRemovePayer') : undefined}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
