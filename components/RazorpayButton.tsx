"use client";
import React from "react";
import Script from "next/script";
import { Button } from "./ui/button";
import { toast } from "sonner"; // ensure <Toaster /> is mounted in app/layout

type Plan = "basic" | "pro" | "premium";

function CheckoutButton({
  plan,
  label,
  initiallyOwned, // send from server if known to avoid flicker
}: {
  plan: Plan;
  label: string;
  initiallyOwned?: boolean;
}) {
  const [loading, setLoading] = React.useState(false);
  const [owned, setOwned] = React.useState<boolean>(!!initiallyOwned);

  // Check entitlement on mount if not provided from server
  React.useEffect(() => {
    let active = true;
    const check = async () => {
      try {
        const res = await fetch(`/api/entitlement?plan=${plan}`, {
          credentials: "include",
        });
        if (!active) return;
        if (res.ok) {
          const { has } = await res.json();
          setOwned(!!has);
        }
      } catch {
        // ignore probe errors
      }
    };
    if (!initiallyOwned) check();
    return () => {
      active = false;
    };
  }, [plan, initiallyOwned]);

  const start = async () => {
    try {
      if (owned) {
        toast.info("Already purchased", {
          description: "This bundle is already active on the account.",
        });
        return;
      }
      setLoading(true);

      // Pre-check again to avoid creating orders on races
      const pre = await fetch(`/api/entitlement?plan=${plan}`, {
        credentials: "include",
      });
      if (pre.ok) {
        const { has } = await pre.json();
        if (has) {
          setOwned(true);
          toast.info("Already purchased", {
            description: "Cannot buy the same bundle twice.",
          });
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (res.status === 401) {
        toast.error("Sign in required", {
          description: "Please sign in to continue checkout.",
        });
        setLoading(false);
        return;
      }
      if (res.status === 409) {
        setOwned(true);
        toast.info("Already purchased", {
          description: "This plan is already active.",
        });
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      const cancel = async (reason: string) => {
        try {
          await fetch("/api/checkout/cancel", {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, reason }),
          });
        } catch {
          // best-effort
        }
      };

      const options = {
        key: data.key,
        order_id: data.orderId,
        amount: data.amount,
        currency: data.currency,
        name: "Animesh Academy",
        description: `Enrollment - ${plan.toUpperCase()}`,
        theme: { color: "#2c5364" },
        handler: async (resp: any) => {
          try {
            const verify = await fetch("/api/verify", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            const { success, error } = await verify.json();
            if (success) {
              setOwned(true);
              toast.success("Payment successful", {
                description: "Access granted to your bundle.",
              });
            } else {
              toast.error("Verification failed", {
                description: error || "Could not verify payment.",
              });
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await cancel("user_dismissed");
            toast.message("Checkout canceled", {
              description: "No charges were made.",
            });
            setLoading(false);
          },
        },
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", async (err: any) => {
        await cancel(err?.error?.description || "payment_failed");
        toast.error("Payment failed", {
          description: "Try another method or card and attempt again.",
        });
        setLoading(false);
      });
      rzp.open();
    } catch (e: any) {
      toast.error("Checkout error", {
        description: e?.message || "Could not start checkout.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={start}
        disabled={loading || owned}
        className="w-full"
      >
        {loading ? "Processing..." : owned ? "Already Purchased" : label}
      </Button>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
    </>
  );
}

export default CheckoutButton;
