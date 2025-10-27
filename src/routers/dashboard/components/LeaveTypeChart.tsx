import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { LeaveTypeDistribution } from '../interface';

interface LeaveTypeChartProps {
  data: LeaveTypeDistribution[];
}

// Use theme color variables
const THEME_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function LeaveTypeChart({ data }: LeaveTypeChartProps) {
  const chartData = data.map((item, index) => ({
    leaveType: item.typeName,
    count: Number(item.count),
    fill: THEME_COLORS[index % THEME_COLORS.length],
  }));

  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.typeName] = {
      label: item.typeName,
      color: THEME_COLORS[index % THEME_COLORS.length],
    };
    return acc;
  }, {} as any);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Type Distribution</CardTitle>
        <CardDescription>Breakdown by leave type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ leaveType, percent }) => `${leaveType}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              dataKey="count"
              nameKey="leaveType"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
