"use client";

import { useEffect } from "react";
import { TrendingUp, MessageSquare } from "lucide-react";
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
import { useContactForm } from "@/hooks/useContactForm";

export const description = "A bar chart showing contact form submissions by month";

const chartConfig = {
    submissions: {
        label: "Messages",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ContactFormChart() {
    const { submissions, fetchSubmissions, loadingData } = useContactForm();

    useEffect(() => {
        fetchSubmissions();
    }, []);

    // Process submissions data to create chart data grouped by month
    const processSubmissionsData = () => {
        if (!submissions.length) {
            return [];
        }

        // Create a map to count submissions by month
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
            monthlyData.set(monthKey, { month: shortMonth, submissions: 0 });
        }

        // Count submissions by month
        submissions.forEach((submission) => {
            // Handle different date field names (createdAt or created_at)
            const submissionDate = new Date(submission.createdAt || submission.created_at || new Date());
            const monthKey = submissionDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            const shortMonth = submissionDate.toLocaleString("default", { month: "long" });

            if (monthlyData.has(monthKey)) {
                monthlyData.get(monthKey).submissions += 1;
            }
        });

        return Array.from(monthlyData.values());
    };

    const chartData = processSubmissionsData();

    // Calculate growth percentage
    const calculateGrowth = () => {
        if (chartData.length < 2) return 0;

        const currentMonth = chartData[chartData.length - 1]?.submissions || 0;
        const previousMonth = chartData[chartData.length - 2]?.submissions || 0;

        if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;

        return Math.round(((currentMonth - previousMonth) / previousMonth) * 100);
    };

    const growthPercentage = calculateGrowth();
    const totalSubmissions = submissions.length;

    // Show loading state
    if (loadingData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Contact Form Submissions
                    </CardTitle>
                    <CardDescription>Monthly contact form submission trends</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="text-muted-foreground">Loading chart data...</div>
                </CardContent>
            </Card>
        );
    }

    // Show empty state
    if (!submissions.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Contact Form Submissions
                    </CardTitle>
                    <CardDescription>Monthly contact form submission trends</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                    <div className="text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No contact submissions available</p>
                        <p className="text-sm">Messages will appear here once received</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Contact Form Submissions
                </CardTitle>
                <CardDescription>
                    Monthly contact form submission trends for the last 6 months
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
                            dataKey="submissions"
                            fill="var(--color-submissions)"
                            radius={8}
                            name="Messages"
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
                    Showing {totalSubmissions} total contact messages across all months
                </div>
            </CardFooter>
        </Card>
    );
}
