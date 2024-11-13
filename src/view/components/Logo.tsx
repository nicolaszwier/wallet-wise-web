import logo from '@/assets/ww-logo.png'

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
return (
   <img src={logo} className={className} alt=""/>
  );
}
