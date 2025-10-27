import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MonthlyLeaveDistribution } from '../interface';

interface MonthlyLeaveChartProps {
  data: MonthlyLeaveDistribution[];
}

export function MonthlyLeaveChart({ data }: MonthlyLeaveChartProps) {
  const chartData = data.map((item) => ({
    month: item.month,
    leaves: item.leaveCount,
  }));

  const chartConfig = {
    leaves: {
      label: 'Leave Applications',
      color: 'var(--chart-2)',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Leave Trend</CardTitle>
        <CardDescription>Leave applications over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="leaves"
              stroke="var(--color-leaves)"
              strokeWidth={2}
              fill="var(--color-leaves)"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
