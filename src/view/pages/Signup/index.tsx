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
import { useSignupController } from "./useSignupController"
import { Spinner } from "@/view/components/ui/Spinner"
import { GoogleLogin } from "@react-oauth/google"
import { useTranslation } from "react-i18next"
import { useSigninController } from "../Signin/useSigninController"

export default function Signup() {
  const { t } = useTranslation()
  const { handleSubmit, register, isPending, errors } = useSignupController()
  const { handleSignInWithGoogleResponse } = useSigninController()

  return (
    <div className="flex bg-background h-screen w-full items-center justify-center px-4">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t('signup.title')}</CardTitle>
        <CardDescription>
          {t('signup.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">{t('signup.name')}</Label>
            <Input
              id="name"
              type="text"
              // required
              {...register('name')}
            />
             <span className="inline-block text-sm text-destructive">
             {t(errors.name?.message as string)}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">{t('signup.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('signup.emailPlaceholder')}
              {...register('email')}
            />
             <span className="inline-block text-sm text-destructive">
             {t(errors.email?.message as string)}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('signup.password')}</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')}
            />
              <span className="inline-block text-sm text-destructive">
              {t(errors.password?.message as string)}
              </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passwordC">{t('signup.confirmPassword')}</Label>
            <Input 
              id="passwordC" 
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
            {t('global.cta.signup')}
          </Button>
          <div className=" text-center text-sm text-muted-foreground">
            {t('global.or')}
          </div>
          <GoogleLogin text="signup_with" onSuccess={handleSignInWithGoogleResponse} />
        </form>
        <div className="mt-4 text-center text-sm">
          {t('signup.alreadyHaveAccount')}{" "}
          <Link to={"/signin"} className="underline">{t('global.cta.signin')}</Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
