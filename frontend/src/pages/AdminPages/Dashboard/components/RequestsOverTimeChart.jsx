// External libraries
import React from 'react';

// Internal
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../../components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from '../../../../components/ui/select';

const RequestsOverTimeChart = ({ chartData, timeRange, onTimeRangeChange, formatChartData, chartConfig }) => {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Requests Created Over Time</CardTitle>
                    <CardDescription>Showing total requests created for the selected period</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={onTimeRangeChange}>
                    <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a timeframe">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90days" className="rounded-lg">Last 3 months</SelectItem>
                        <SelectItem value="30days" className="rounded-lg">Last 30 days</SelectItem>
                        <SelectItem value="7days" className="rounded-lg">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={formatChartData()}>
                        <defs>
                            <linearGradient id="fillRequests" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-UK", { month: "short", day: "numeric" });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area dataKey="count" type="natural" fill="url(#fillRequests)" stroke="var(--color-desktop)" stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RequestsOverTimeChart;
