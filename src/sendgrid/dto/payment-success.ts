export interface PaymentSuccessEmailDto {
  order_code: string;
  customer_name: string;
  total_amount: string;
  payment_method: string;
  payment_time: string;
}
