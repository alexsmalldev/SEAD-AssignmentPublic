// External libraries
import React from 'react';

// Internal
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../../components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';

const RequestsByBuildingChart = ({ requestsByBuilding, chartConfig }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Requests by Building</CardTitle>
                <CardDescription>June 2024 - Current</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={requestsByBuilding} layout="vertical" margin={{ right: 16 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="building__name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="count" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="count" layout="vertical" fill="var(--color-desktop)" radius={8} barSize={60}>
                            <LabelList dataKey="building__name" position="insideLeft" offset={8} className="fill-[--color-label]" fontSize={12} />
                            <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RequestsByBuildingChart;
