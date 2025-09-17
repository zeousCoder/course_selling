"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { LineShadowText } from "../magicui/line-shadow-text";
import { useTheme } from "next-themes";
import CheckoutButton from "../RazorpayButton";
import { usePathname } from "next/navigation";

export default function Pricing() {
  const pathname = usePathname();

  const plans = [
    {
      name: "Basic",
      price: "₹9,999",
      tagline: "Perfect for Learning Core Concepts",
      features: [
        "Live Classes on Advanced Excel",
        "Live Classes on Advanced Dashboard",
        "2 Capsule Series",
        "Live Projects",
        "Surprise Q&A Calls",
      ],
      highlight: false,
      status: "available",
      button: "Choose Basic",
    },
    {
      name: "Pro",
      price: "₹19,999",
      tagline: "Great for hands-on learning",
      features: [
        "Everything in Basic",
        "Live interactive sessions",
        "2 guided projects",
        "Q&A support",
      ],
      highlight: true,
      status: "comingsoon", // change to 'available' if you open this plan
      button: "Coming Soon",
    },
    {
      name: "Premium",
      price: "₹29,999",
      tagline: "Best for career growth",
      features: [
        "Everything in Pro",
        "1-on-1 mentorship",
        "Job placement support",
        "Capstone project",
        "Resume optimization",
      ],
      highlight: true,
      status: "launching",
      button: "Launching Soon — Working on it",
    },
  ];

  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  type Plan = {
    name: string;
    price: string;
    tagline: string;
    features: string[];
    highlight: boolean;
    status: string;
    button: string;
  };

  function getBadge(plan: Plan) {
    if (plan.status === "comingsoon") {
      return (
        <span className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow z-10 dark:bg-yellow-900 dark:text-yellow-200">
          Coming Soon
        </span>
      );
    }
    if (plan.status === "launching") {
      return (
        <span className="absolute top-4 left-4 bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full shadow z-10 dark:bg-pink-900 dark:text-pink-200">
          Launching Soon
        </span>
      );
    }
    if (plan.highlight && plan.status === "available") {
      return (
        <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
          Most Popular
        </span>
      );
    }
    return null;
  }

  return (
    <section className="container mx-auto">
      <div className="flex flex-col mb-12 gap-4 items-center justify-center text-center w-full">
        <h1 className="text-balance text-5xl text-center font-bold leading-none tracking-tighter">
          Pricing &{" "}
          <LineShadowText className="italic" shadowColor={shadowColor}>
            Enrollment
          </LineShadowText>
        </h1>
        <p className="text-lg mb-6">
          Choose the plan that fits your learning style and career goals.
          Whether you’re just starting out or aiming for career transformation,
          we’ve got a plan tailored for you.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-3 grid-cols-1 lg:px-0 px-4 mx-auto">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className={`
              relative border-0 rounded-2xl shadow-2xl overflow-hidden
              bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]
              text-white flex flex-col justify-between
              ${plan.highlight ? "scale-105 ring-2 ring-yellow-400" : ""}
            `}
          >
            {/* Top-left dynamic badge */}
            {getBadge(plan)}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-semibold">
                {plan.name}
              </CardTitle>
              <p className="mt-2 text-3xl font-bold">{plan.price}</p>
              <p className="mt-1 text-gray-300">{plan.tagline}</p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="mt-6 space-y-3 text-gray-200">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-green-400">✓</span>
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
            </CardContent>

            <div className="p-6">
              {plan.status === "available" ? (
                <CheckoutButton
                  plan={plan.name.toLowerCase() as "basic" | "pro" | "premium"}
                  label={plan.button}
                />
              ) : (
                <Button
                  className="w-full cursor-not-allowed opacity-60"
                  disabled
                >
                  Disabled
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
