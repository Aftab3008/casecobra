import ThankYou from "@/components/shared/ThankYou";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
