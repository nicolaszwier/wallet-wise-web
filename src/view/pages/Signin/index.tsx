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
import { useSigninController } from "./useSigninController"
import { Spinner } from "@/view/components/ui/spinner"
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

export default function Signin() {
  const {t} = useTranslation()
  const {handleSubmit, register, handleSignInWithGoogleResponse, isPending, errors} = useSigninController()

  return (
    <div className="flex bg-background h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t('signin.title')}</CardTitle>
          <CardDescription>
            {t('signin.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('signin.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signin.emailPlaceholder')}
                {...register('email')}
              />
              <span className="inline-block text-sm text-destructive">
                {t(errors.email?.message as string)}
              </span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('signin.password')}</Label>
                {/* <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a> */}
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="********"
                {...register('password')} 
              />
              <span className="inline-block text-sm text-destructive">
                {t(errors.password?.message as string)}
              </span>
            </div>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Spinner />}
              {t('global.cta.signin')}
            </Button>
            <div className=" text-center text-sm text-muted-foreground">
              {t('global.or')}
            </div>
            <GoogleLogin onSuccess={handleSignInWithGoogleResponse} />
          </form>
          <div className="mt-4 text-center text-sm">
            {t('signin.doesntHaveAccount')}{" "}
            <Link to="/signup" className="underline">{t('signin.signup')}</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
