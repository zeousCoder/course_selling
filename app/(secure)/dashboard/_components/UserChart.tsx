"use client";

import { useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserList } from "@/hooks/useListUser";

export const description = "A bar chart showing user registrations by month";

const chartConfig = {
    users: {
        label: "Users",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function UserChart() {
    const { users, fetchUsers, loadingData } = useUserList();

    useEffect(() => {
        fetchUsers();
    }, []);

    // Process user data to create chart data grouped by month
    const processUserData = () => {
        if (!users.length) {
            return [];
        }

        // Create a map to count users by month
        const monthlyData = new Map();

        // Initialize last 6 months
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            const shortMonth = date.toLocaleString("default", { month: "long" });
            months.push(shortMonth);
            monthlyData.set(monthKey, { month: shortMonth, users: 0 });
        }

        // Count users by month
        users.forEach((user) => {
            const userDate = new Date(user.createdAt);
            const monthKey = userDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            const shortMonth = userDate.toLocaleString("default", { month: "long" });

            if (monthlyData.has(monthKey)) {
                monthlyData.get(monthKey).users += 1;
            }
        });

        return Array.from(monthlyData.values());
    };

    const chartData = processUserData();

    // Calculate growth percentage
    const calculateGrowth = () => {
        if (chartData.length < 2) return 0;

        const currentMonth = chartData[chartData.length - 1]?.users || 0;
        const previousMonth = chartData[chartData.length - 2]?.users || 0;

        if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;

        return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    };

    const growthPercentage = calculateGrowth();
    const totalUsers = users.length;

    // Show loading state
    if (loadingData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Registrations</CardTitle>
                    <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="text-muted-foreground">Loading chart data...</div>
                </CardContent>
            </Card>
        );
    }

    // Show empty state
    if (!users.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Registrations</CardTitle>
                    <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <p>No user data available</p>
                        <p className="text-sm">Users will appear here once they register</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Registrations</CardTitle>
                <CardDescription>
                    Monthly user registration trends for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="users"
                            fill="var(--color-users)"
                            radius={8}
                            name="New Users"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {growthPercentage > 0 ? (
                        <>
                            Trending up by {growthPercentage}% this month{" "}
                            <TrendingUp className="h-4 w-4" />
                        </>
                    ) : growthPercentage < 0 ? (
                        <>
                            Down by {Math.abs(growthPercentage)}% this month{" "}
                            <TrendingUp className="h-4 w-4 rotate-180" />
                        </>
                    ) : (
                        "No change from last month"
                    )}
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing {totalUsers} total registered users across all months
                </div>
            </CardFooter>
        </Card>
    );
}
