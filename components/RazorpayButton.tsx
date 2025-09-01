"use client";
import React from "react";
import Script from "next/script";
import { Button } from "./ui/button";

function CheckoutButton({
  plan,
  label,
}: {
  plan: "basic" | "pro" | "premium";
  label: string;
}) {
  const [loading, setLoading] = React.useState(false);

  const start = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      const options = {
        key: data.key,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "shgascn Academy",
        description: `Enrollment - ${plan.toUpperCase()}`,
        theme: { color: "#2c5364" },
        handler: async (resp: any) => {
          const verify = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            }),
          });
          const ok = (await verify.json()).success;
          alert(ok ? "Payment successful!" : "Verification failed.");
        },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", () => setLoading(false));
      rzp.open();
    } catch (e) {
      setLoading(false);
      alert("Could not start checkout.");
    }
  };

  return (
    <>
      <Button
        onClick={start}
        disabled={loading}
        className="w-full py-6 text-lg font-semibold rounded-full"
      >
        {loading ? "Processing..." : label}
      </Button>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
    </>
  );
}

export default CheckoutButton;
