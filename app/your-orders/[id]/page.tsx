import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import OrderCard from "@/components/shared/OrderCard";
import { getUserOrders } from "@/lib/actions/actions";
import { currentUser } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  const user = await currentUser();
  const orders = await getUserOrders({ userId: id });
  if (!user || !orders) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  if (user && id !== user.id) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-red-700">You are not authorized to view this page</p>
      </div>
    );
  }

  return (
    <div className="mt-14">
      <MaxWidthWrapper>
        <div className="flex gap-10">
          <Image
            src={user.imageUrl}
            alt="user avatar"
            className="w-20 h-20 rounded-full"
            width={80}
            height={80}
          />
          <div className="flex justify-center items-center">
            <p>{user.emailAddresses[0].emailAddress}</p>
          </div>
        </div>
        <div className="mt-10 flex">
          <h1 className="bg-zinc-200 rounded-lg  p-4">Your Orders</h1>
        </div>
        <div className="mt-10">
          {orders.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
              {orders.map((order) => (
                <OrderCard order={order} />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-lg">No orders yet</p>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
