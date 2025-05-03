export class NewOrderNotificationDto {
  order_code: string;
  order_detail_url: string;
  receiver_full_name: string;
  receiver_phone: string;
  receiver_address: string;
  products: {
    product_name: string;
    product_image: string;
    product_quantity: number;
    product_variant: string;
    product_price: string;
  }[];
  total_price: string;
  delivery_method: string;
  shipping_fee: string;
  total_amount: string;
}
