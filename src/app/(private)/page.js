"use client"

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Line,
    LineChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    Rectangle,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { createClient } from "@/utils/supabase/client"
import { startOfMonth, subMonths } from 'date-fns';
import { useState, useEffect } from 'react'
// Make sure to import date-fns or use native Date methods

export const description = "A collection of health charts."

const supabase = createClient()
export default function Charts() {
    const [membershipData, setMembershipData] = useState([])

    async function updateSubscriptionData() {
        try {
            const today = new Date();
            const sixMonthsAgo = subMonths(today, 6);
            const startOfSixMonthsAgo = startOfMonth(sixMonthsAgo); // Get the start of the month for six months ago

            const { data, error } = await supabase
                .from('memberships')
                .select('membership_type, count(*)')
                .gte('created_at', startOfSixMonthsAgo.toISOString()) // Filter for created_at from the start of the last 6 months
                .group('membership_type') // Group by membership_type
                .order('membership_type'); // Optional: order by membership_type

            if (error) {
                throw error;
            }

            return data; // Return the fetched data

        } catch (error) {
            console.error('Error fetching subscription data:', error);
            return null;
        }
    }

    useEffect(() => {
        updateSubscriptionData().then(data => {
            setMembershipData(data)
        }).catch(error => {
            console.error('Error fetching subscription data:', error);
        })
    }, [])
    return (
        <div className="chart-wrapper flex  flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
            <div className="grid w-full gap-6 sm:grid-cols-2">
                <Card
                    className="w-full" x-chunk="charts-01-chunk-0"
                >
                    <CardHeader className="space-y-0 pb-2">
                        <CardDescription>Today</CardDescription>
                        <CardTitle className="text-4xl tabular-nums">
                            12,584{" "}
                            <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                                steps
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                steps: {
                                    label: "Steps",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                        >
                            <BarChart
                                accessibilityLayer
                                margin={{
                                    left: -4,
                                    right: -4,
                                }}
                                data={[
                                    {
                                        date: "2024-01-01",
                                        steps: 2000,
                                    },
                                    {
                                        date: "2024-01-02",
                                        steps: 2100,
                                    },
                                    {
                                        date: "2024-01-03",
                                        steps: 2200,
                                    },
                                    {
                                        date: "2024-01-04",
                                        steps: 1300,
                                    },
                                    {
                                        date: "2024-01-05",
                                        steps: 1400,
                                    },
                                    {
                                        date: "2024-01-06",
                                        steps: 2500,
                                    },
                                    {
                                        date: "2024-01-07",
                                        steps: 1600,
                                    },
                                ]}
                            >
                                <Bar
                                    dataKey="steps"
                                    fill="var(--color-steps)"
                                    radius={5}
                                    fillOpacity={0.6}
                                    activeBar={<Rectangle fillOpacity={0.8} />}
                                />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={4}
                                    tickFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                    }}
                                />
                                <ChartTooltip
                                    defaultIndex={2}
                                    content={
                                        <ChartTooltipContent
                                            hideIndicator
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                            }}
                                        />
                                    }
                                    cursor={false}
                                />
                                <ReferenceLine
                                    y={1200}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                >
                                    <Label
                                        position="insideBottomLeft"
                                        value="Average Steps"
                                        offset={10}
                                        fill="hsl(var(--foreground))"
                                    />
                                    <Label
                                        position="insideTopLeft"
                                        value="12,343"
                                        className="text-lg"
                                        fill="hsl(var(--foreground))"
                                        offset={10}
                                        startOffset={100}
                                    />
                                </ReferenceLine>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1">
                        <CardDescription>
                            Over the past 7 days, you have walked{" "}
                            <span className="font-medium text-foreground">53,305</span> steps.
                        </CardDescription>
                        <CardDescription>
                            You need{" "}
                            <span className="font-medium text-foreground">12,584</span> more
                            steps to reach your goal.
                        </CardDescription>
                    </CardFooter>
                </Card>
                <Card
                    className="flex flex-col" x-chunk="charts-01-chunk-1"
                >
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                        <div>
                            <CardDescription>Resting HR</CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                62
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                                    bpm
                                </span>
                            </CardTitle>
                        </div>
                        <div>
                            <CardDescription>Variability</CardDescription>
                            <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                                35
                                <span className="text-sm font-normal tracking-normal text-muted-foreground">
                                    ms
                                </span>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 items-center">
                        <ChartContainer
                            config={{
                                resting: {
                                    label: "Resting",
                                    color: "hsl(var(--chart-1))",
                                },
                            }}
                            className="w-full h-full"
                        >
                            <LineChart
                                accessibilityLayer
                                margin={{
                                    left: 14,
                                    right: 14,
                                    top: 10,
                                }}
                                data={[
                                    {
                                        date: "2024-01-01",
                                        resting: 62,
                                    },
                                    {
                                        date: "2024-01-02",
                                        resting: 72,
                                    },
                                    {
                                        date: "2024-01-03",
                                        resting: 35,
                                    },
                                    {
                                        date: "2024-01-04",
                                        resting: 62,
                                    },
                                    {
                                        date: "2024-01-05",
                                        resting: 52,
                                    },
                                    {
                                        date: "2024-01-06",
                                        resting: 62,
                                    },
                                    {
                                        date: "2024-01-07",
                                        resting: 70,
                                    },
                                ]}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeOpacity={0.5}
                                />
                                <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            weekday: "short",
                                        })
                                    }}
                                />
                                <Line
                                    dataKey="resting"
                                    type="natural"
                                    fill="var(--color-resting)"
                                    stroke="var(--color-resting)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{
                                        fill: "var(--color-resting)",
                                        stroke: "var(--color-resting)",
                                        r: 4,
                                    }}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            indicator="line"
                                            labelFormatter={(value) => {
                                                return new Date(value).toLocaleDateString("en-US", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })
                                            }}
                                        />
                                    }
                                    cursor={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
