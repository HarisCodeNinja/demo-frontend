import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { AttendanceStats } from '../interface';

interface AttendanceTrendChartProps {
  data: AttendanceStats[];
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Present: item.present,
    Absent: item.absent,
    Late: item.late,
  }));

  const chartConfig = {
    Present: {
      label: 'Present',
      color: 'hsl(var(--chart-1))',
    },
    Absent: {
      label: 'Absent',
      color: 'hsl(var(--chart-2))',
    },
    Late: {
      label: 'Late',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>Last 7 days attendance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="Present" stroke="var(--color-Present)" strokeWidth={2} />
            <Line type="monotone" dataKey="Absent" stroke="var(--color-Absent)" strokeWidth={2} />
            <Line type="monotone" dataKey="Late" stroke="var(--color-Late)" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
