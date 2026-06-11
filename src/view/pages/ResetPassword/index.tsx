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
import { Link } from "react-router-dom"
import { Spinner } from "@/view/components/ui/spinner"
import { useTranslation } from 'react-i18next';
import { useResetPasswordController } from "./useResetPasswordController"

export default function ResetPassword() {
  const { t } = useTranslation()
  const {
    handleSubmit,
    register,
    isPending,
    errors,
    token,
  } = useResetPasswordController()

  return (
    <div className="flex bg-background h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('resetPassword.title')}</CardTitle>
          <CardDescription>
            {token ? t('resetPassword.description') : t('resetPassword.invalidTokenDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="grid gap-4">
              <p className="text-sm text-destructive">
                {t('resetPassword.invalidToken')}
              </p>
              <Button asChild className="w-full">
                <Link to="/forgot-password">{t('resetPassword.requestNewLink')}</Link>
              </Button>
              <div className="text-center text-sm">
                <Link to="/signin" className="underline">{t('resetPassword.backToSignin')}</Link>
              </div>
            </div>
          ) : (
            <>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">{t('resetPassword.newPassword')}</Label>
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
                  <Label htmlFor="passwordConfirmation">{t('resetPassword.confirmPassword')}</Label>
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
                <Button disabled={isPending} type="submit" className="w-full">
                  {isPending && <Spinner />}
                  {t('resetPassword.submit')}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <Link to="/signin" className="underline">{t('resetPassword.backToSignin')}</Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
