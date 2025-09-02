"use client";
import React, { useEffect } from "react";
import { ChartArea, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContactForm } from "@/hooks/useContactForm";
import { ContactFormChart } from "../ContactFormChart";
import { UserChart } from "../UserChart";
import { OrderStatusChart } from "../OrderStatus";

export default function StatsTab() {
    return (
        <div className="w-full space-y-6 p-3">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ChartArea className="w-6 h-6" />
                        Statistics Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        View analytics and insights for your website
                    </p>
                </div>
            </div>

            {/* Chart Component */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                <UserChart />
                <OrderStatusChart />
                {/* <ContactFormChart /> */}
            </div>
        </div>
    );
}
