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
import { Spinner } from "@/view/components/ui/Spinner"
// import { Spinner } from "@/view/components/ui/Spinner"

export default function Signin() {
  const {handleSubmit, register, isPending, errors} = useSigninController()
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login to WalletWise</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="mail@example.com"
                required
                {...register('email')}
              />
              <span className="inline-block text-sm text-destructive">
                {errors.email?.message}
              </span>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {/* <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a> */}
              </div>
              <Input 
                id="password" 
                type="password" 
                required  
                {...register('password')} 
              />
              <span className="inline-block text-sm text-destructive">
                {errors.password?.message}
              </span>
            </div>
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Spinner />}
              Login
            </Button>
          
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">Sign up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
