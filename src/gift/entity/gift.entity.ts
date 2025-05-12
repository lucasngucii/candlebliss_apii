import { Image } from "../../images/domain/image";

export interface GiftProduct {
  pdId: number
}
export interface Gift {
  id: string
  name: string
  description: string
  images: Image[]
  products: GiftProduct[]
  base_price: number
  discount_price: number
  start_date: Date
  end_date: Date
}