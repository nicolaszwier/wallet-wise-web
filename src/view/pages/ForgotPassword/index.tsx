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
import { useForgotPasswordController } from "./useForgotPasswordController"

export default function ForgotPassword() {
  const { t } = useTranslation()
  const {
    handleSubmit,
    register,
    isPending,
    errors,
    isSubmitted,
  } = useForgotPasswordController()

  return (
    <div className="flex bg-background h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('forgotPassword.title')}</CardTitle>
          <CardDescription>
            {isSubmitted ? t('forgotPassword.successDescription') : t('forgotPassword.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="grid gap-4">
              <p className="text-sm text-muted-foreground">
                {t('forgotPassword.successMessage')}
              </p>
              <Button asChild className="w-full">
                <Link to="/signin">{t('forgotPassword.backToSignin')}</Link>
              </Button>
            </div>
          ) : (
            <>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('forgotPassword.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    {...register('email')}
                  />
                  <span className="inline-block text-sm text-destructive">
                    {t(errors.email?.message as string)}
                  </span>
                </div>
                <Button disabled={isPending} type="submit" className="w-full">
                  {isPending && <Spinner />}
                  {t('forgotPassword.submit')}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <Link to="/signin" className="underline">{t('forgotPassword.backToSignin')}</Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
