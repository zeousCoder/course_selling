import Pricing from "@/components/home/PaymentCard";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Metadata } from "next";

import React from "react";

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-20 mx-auto justify-center items-center px-4  pt-26 pb-10">
      <Pricing />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Pricing",
  description: "Projects page",
};
