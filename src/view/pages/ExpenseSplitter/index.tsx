import { useTranslation } from 'react-i18next';
import { useExpenseSplitterController } from './useExpenseSplitterController';
import { useExportExpensesController } from './useExportExpensesController';
import { SessionSelector } from './components/SessionSelector';
import { ParticipantsSection } from './components/ParticipantsSection';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpensesList } from './components/ExpensesList';
import { SettlementResults } from './components/SettlementResults';
import { ExportExpensesPanel } from './components/ExportExpensesPanel';
import { ExportExpensesDialog } from './components/ExportExpensesDialog';

export default function ExpenseSplitter() {
  const { t, i18n } = useTranslation();
  const controller = useExpenseSplitterController();
  const exportController = useExportExpensesController({
    onExpenseExported: controller.markExpenseExported,
    onSettlementExported: controller.markSettlementExported,
  });

  const {
    store,
    activeSession,
    signedIn,
    user,
    currentUserParticipant,
    myExpenses,
    myDebts,
    owedToMe,
    balances,
    settlements,
    showResults,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    setCurrency,
    addParticipant,
    removeParticipant,
    addExpense,
    removeExpense,
    toggleSettlementPaid,
  } = controller;

  const isPayer = (id: string) => activeSession.expenses.some((e) => e.payerId === id);

  return (
    <div className="h-full relative p-2 md:p-4">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-8 md:pb-12">
        <h1 className="text-2xl font-bold">{t('expenseSplitter.title')}</h1>

        <SessionSelector
          sessions={store.sessions}
          activeSessionId={store.activeSessionId}
          activeSession={activeSession}
          onSwitch={switchSession}
          onCreate={createSession}
          onDelete={deleteSession}
          onRename={renameSession}
          onCurrencyChange={setCurrency}
        />

        <ParticipantsSection
          participants={activeSession.participants}
          currentUserEmail={user?.email}
          onAdd={addParticipant}
          onRemove={removeParticipant}
          isPayer={isPayer}
        />

        <ExpenseForm
          participants={activeSession.participants}
          currency={activeSession.currency}
          onAdd={addExpense}
        />

        <ExpensesList
          expenses={activeSession.expenses}
          participants={activeSession.participants}
          currency={activeSession.currency}
          locale={i18n.language}
          onRemove={removeExpense}
        />

        <SettlementResults
          sessionName={activeSession.name}
          settlements={settlements}
          balances={balances}
          participants={activeSession.participants}
          expenses={activeSession.expenses}
          paidSettlementKeys={activeSession.paidSettlementKeys ?? []}
          currency={activeSession.currency}
          locale={i18n.language}
          showResults={showResults}
          onTogglePaid={toggleSettlementPaid}
        />

        {signedIn && currentUserParticipant && (
          <>
            <ExportExpensesPanel
              sessionName={activeSession.name}
              participants={activeSession.participants}
              expenses={myExpenses}
              myDebts={myDebts}
              owedToMe={owedToMe}
              exportedSettlementKeys={activeSession.exportedSettlementKeys ?? []}
              currency={activeSession.currency}
              locale={i18n.language}
              onExport={exportController.openExport}
            />
            <ExportExpensesDialog
              controller={exportController}
              currency={activeSession.currency}
            />
          </>
        )}
      </div>
    </div>
  );
}
