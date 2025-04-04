import { Ban, Book, CalendarSync, Car, CircleDollarSign, CircleEllipsis, CreditCard, Gift, HandCoins, Heart, House, Newspaper, Plane, ShieldCheck, ShoppingBasket, ShoppingCart, TvMinimalPlay, Utensils, Wrench } from "lucide-react";
import { cloneElement } from "react";

const iconsMapping = {
  'dollarsign.circle.fill': <CircleDollarSign />,
  'ellipsis.circle.fill': <CircleEllipsis />,
  'heart.fill': <Heart />,
  'cart.fill': <ShoppingCart />,
  'dollarsign.arrow.circlepath': <CalendarSync />,
  'creditcard.circle.fill': <CreditCard />,
  'wrench.and.screwdriver.fill': <Wrench />,
  'newspaper.fill': <Newspaper />,
  'basket.fill': <ShoppingBasket />,
  'checkmark.shield.fill': <ShieldCheck />,
  'square.and.arrow.down.fill': <HandCoins />,
  'airplane.circle.fill': <Plane />,
  'fork.knife.circle.fill': <Utensils />,
  'play.tv.fill': <TvMinimalPlay />,
  'gift.fill': <Gift />,
  'house.fill': <House />,
  'car.fill': <Car />,
  'book.fill': <Book />
}

export type IconName = keyof typeof iconsMapping;

interface ComponentProps {
  name: IconName;
  size?: number
}

export function Icon({name, size = 24}: ComponentProps) {
  const IconComponent = iconsMapping[name];
  if (!IconComponent) {
    return (
      <Ban size={size} />
    )
  }
  return cloneElement(IconComponent, { size });
}