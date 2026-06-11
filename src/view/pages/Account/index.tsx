import { Button } from "@/view/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/view/components/ui/card"
import { Input } from "@/view/components/ui/input"
import { Label } from "@/view/components/ui/label"
import { Spinner } from "@/view/components/ui/spinner"
import { useTranslation } from 'react-i18next';
import { useChangePasswordController } from "./useChangePasswordController"
import { useDeleteAccountController } from "./useDeleteAccountController"
import { DeleteAccountDialog } from "./components/DeleteAccountDialog"
import { Switch } from "@/view/components/ui/switch"
import { isAnalyticsOptedOut, setAnalyticsOptOut } from "@/app/analytics/telemetryDeck"
import { useState } from "react"

const PRIVACY_POLICY_URL = "https://walletwise.cash/privacy-policy"

export default function Account() {
  const { t } = useTranslation()
  const [analyticsEnabled, setAnalyticsEnabled] = useState(() => !isAnalyticsOptedOut())
  const {
    handleSubmit,
    register,
    isPending,
    errors,
  } = useChangePasswordController()
  const {
    dialogOpen,
    setDialogOpen,
    confirmationInput,
    setConfirmationInput,
    canConfirm,
    handleDelete,
    isPending: isDeleting,
  } = useDeleteAccountController()

  return (
    <div className="h-full w-full">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-2 sm:p-4">
        <div className="mb-2 flex flex-col gap-3 px-2">
          <div className="min-w-0">
            <h1 className="text-xl font-bold sm:text-2xl">{t('account.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('account.description')}</p>
          </div>
        </div>

      <Card className="bg-background-secondary">
        <CardHeader>
          <CardTitle>{t('changePassword.title')}</CardTitle>
          <CardDescription>{t('changePassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">{t('changePassword.currentPassword')}</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
              />
              <span className="inline-block text-sm text-destructive">
                {t(errors.currentPassword?.message as string)}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">{t('changePassword.newPassword')}</Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
              />
              <span className="inline-block text-sm text-destructive">
                {t(errors.newPassword?.message as string)}
              </span>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="passwordConfirmation">{t('changePassword.confirmPassword')}</Label>
              <Input
                id="passwordConfirmation"
                type="password"
                {...register('passwordConfirmation')}
              />
              <span className="inline-block text-sm text-destructive">
                {t(errors.passwordConfirmation?.message as string)}
              </span>
              <span className="inline-block text-sm text-muted-foreground">
                {t('signup.passwordInfo')}
              </span>
            </div>
            <Button disabled={isPending} type="submit">
              {isPending && <Spinner />}
              {t('changePassword.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-background-secondary">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Manage how WalletWise collects anonymous usage data.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="analytics-toggle">Share anonymous usage data</Label>
            <Switch
              id="analytics-toggle"
              checked={analyticsEnabled}
              onCheckedChange={(checked) => {
                setAnalyticsEnabled(checked);
                setAnalyticsOptOut(!checked);
              }}
            />
          </div>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
        </CardContent>
      </Card>

      <Card className="bg-background-secondary">
        <CardHeader>
          <CardTitle>{t('deleteAccount.title')}</CardTitle>
          <CardDescription>{t('deleteAccount.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full" onClick={() => setDialogOpen(true)}>
            {t('deleteAccount.cta')}
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        confirmationInput={confirmationInput}
        onConfirmationInputChange={setConfirmationInput}
        canConfirm={canConfirm}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
      </div>
    </div>
  )
}

