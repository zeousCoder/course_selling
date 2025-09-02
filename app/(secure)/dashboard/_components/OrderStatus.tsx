"use client"

import { Pie, PieChart } from "recharts"
import { TrendingUp } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import { getOrders, type OrderStatusT } from "@/actions/orderListAction"
import { useEffect, useState } from "react"

export const description = "A pie chart styled like area chart with footer"

export function OrderStatusChart() {
    const [chartData, setChartData] = useState<any[]>([])

    useEffect(() => {
        async function loadOrders() {
            const { data: orders } = await getOrders()

            const statusCounts: Record<OrderStatusT, number> = {
                CREATED: 0,
                PENDING: 0,
                PAID: 0,
                FAILED: 0,
                CANCELED: 0,
            }

            for (const order of orders) {
                statusCounts[order.status as OrderStatusT]++
            }

            const transformed = Object.entries(statusCounts).map(([status, count], idx) => ({
                status,
                value: count,
                fill: `var(--chart-${idx + 1})`,
            }))

            setChartData(transformed)
        }

        loadOrders()
    }, [])

    const chartConfig = {
        CREATED: { label: "Created", color: "var(--chart-1)" },
        PENDING: { label: "Pending", color: "var(--chart-2)" },
        PAID: { label: "Paid", color: "var(--chart-3)" },
        FAILED: { label: "Failed", color: "var(--chart-4)" },
        CANCELED: { label: "Canceled", color: "var(--chart-5)" },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
                <CardDescription>
                    Live breakdown of all orders
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="status" />
                        <ChartLegend content={<ChartLegendContent nameKey="status" />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Orders trend improving <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            Updated in real-time from system
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
