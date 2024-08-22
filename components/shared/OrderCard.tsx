import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrderCard({ order }: any) {
  const { isPaid, amount, status } = order;
  const { name, street, city, postalCode, country } = order.shippingAddress;
  const shipping_Color =
    status === "fulfilled"
      ? "text-green-500"
      : status === "shipped"
      ? "text-yellow-300"
      : "text-yellow-600";

  const shipping_Text =
    status === "fulfilled"
      ? "Fullfilled"
      : status === "shipped"
      ? "Shipped"
      : "Awaiting Shipment";

  return (
    <Card>
      <CardHeader>
        <CardTitle>OrderID</CardTitle>
        <CardDescription>#{order.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <p className="text-sm">Amount: $ {amount}</p>
          <p className={`${isPaid ? "text-green-500" : "text-yellow-500"}`}>
            {order.isPaid ? "Payment Done" : "Payment Pending"}
          </p>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          <p className="text-lg">Shipping Address:</p>
          <p className="text-sm">{name},</p>
          <p className="text-sm">{street},</p>
          <p className="text-sm">{city},</p>
          <p className="text-sm">
            {country}, {postalCode}
          </p>
          <p className={`${shipping_Color} `}>• {shipping_Text}</p>
        </div>
      </CardContent>
    </Card>
  );
}
