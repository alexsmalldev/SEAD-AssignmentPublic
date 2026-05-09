// External libraries
import React from 'react';

// Internal
import { Radar, RadarChart, PolarAngleAxis, PolarGrid } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../../../components/ui/chart';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/card';


const RequestsByServiceTypeChart = ({ requestsByServiceType, chartConfig }) => {
    return (
        <Card>
            <CardHeader className="items-left">
                <CardTitle>Requests by Service Type</CardTitle>
                <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadarChart data={requestsByServiceType}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="service_request_item__name" />
                        <PolarGrid />
                        <Radar
                            dataKey="count"
                            fill="var(--color-desktop)"
                            fillOpacity={0.6}
                            dot={{ r: 4, fillOpacity: 1 }}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default RequestsByServiceTypeChart;
