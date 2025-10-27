import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { EmployeeDistribution } from '../interface';

interface EmployeeDistributionChartProps {
  data: EmployeeDistribution[];
}

export function EmployeeDistributionChart({ data }: EmployeeDistributionChartProps) {
  const chartData = data.map((item) => ({
    department: item.departmentName,
    employees: Number(item.employeeCount),
  }));

  const chartConfig = {
    employees: {
      label: 'Employees',
      color: 'var(--chart-1)',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Distribution</CardTitle>
        <CardDescription>Employees by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="department"
              angle={-45}
              textAnchor="end"
              height={100}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="employees" fill="var(--color-employees)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
