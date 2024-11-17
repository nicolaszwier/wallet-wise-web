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

export default function Signup() {
  const {handleSubmit, register, isPending, errors} = useSignupController()
  const { handleSignInWithGoogleResponse } = useSigninController()

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Signup to WalletWise</CardTitle>
        <CardDescription>
          Enter the information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              // required
              {...register('name')}
            />
             <span className="inline-block text-sm text-destructive">
              {errors.name?.message}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              // required
              {...register('email')}
            />
             <span className="inline-block text-sm text-destructive">
              {errors.email?.message}
            </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')}
            />
              <span className="inline-block text-sm text-destructive">
                {errors.password?.message}
              </span>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passwordC">Confirm Password</Label>
            <Input 
              id="passwordC" 
              type="password" 
              {...register('passwordConfirmation')}
            />
            <span className="inline-block text-sm text-destructive">
            {errors.passwordConfirmation?.message}
            </span>
            <span className="inline-block text-sm text-muted-foreground">
              Your password should be at least 8 characters long and contain: at least one letter, one digit and one especial character
            </span>
          </div>
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending && <Spinner />}
             Signup
          </Button>
          <GoogleLogin text="signup_with" onSuccess={handleSignInWithGoogleResponse} />
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to={"/signin"} className="underline">Signin</Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
