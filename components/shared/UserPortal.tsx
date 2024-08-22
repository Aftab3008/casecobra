import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ArrowRight, LogOut, ShoppingCart } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function UserPortal({
  imageUrl,
  email,
  id,
}: {
  imageUrl: string;
  email: string;
  id: string;
}) {
  return (
    <Sheet>
      <SheetTrigger className="ml-5">
        <HamburgerMenuIcon className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="z-[999999] flex flex-col">
        <div className="flex flex-col h-full justify-between">
          <div>
            <SheetHeader>
              <SheetTitle>
                <SheetClose asChild>
                  <Link href="/" className="flex z-40 font-semibold mb-5">
                    case<span className="text-green-600">cobra</span>
                  </Link>
                </SheetClose>
              </SheetTitle>
              <SheetDescription>
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={imageUrl} />
                    <AvatarFallback>{email[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex justify-center items-center">
                    <p className="font-semibold">{email}</p>
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
            <div className="mt-10 flex flex-col gap-4">
              <SheetClose asChild>
                <Link
                  href="/configure/upload"
                  className="flex items-center gap-1 p-3 hover:bg-gray-100 rounded-xl"
                >
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href={`/your-orders/${id}`}
                  className="flex items-center gap-1 p-3 hover:bg-gray-100 rounded-xl"
                >
                  Your Orders
                  <ShoppingCart className="h-5 w-5 ml-2" />
                </Link>
              </SheetClose>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <SignOutButton redirectUrl="/">
              <SheetClose asChild>
                <Button className="flex items-center gap-1 p-3 w-full">
                  Sign out
                  <LogOut className="h-5 w-5 ml-2" />
                </Button>
              </SheetClose>
            </SignOutButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
