import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { DepartmentWiseAttendance } from '../interface';

interface DepartmentAttendanceChartProps {
  data: DepartmentWiseAttendance[];
}

export function DepartmentAttendanceChart({ data }: DepartmentAttendanceChartProps) {
  const chartData = data.map((item) => ({
    department: item.departmentName,
    present: item.present,
    absent: item.absent,
    rate: item.attendanceRate,
  }));

  const chartConfig = {
    present: {
      label: 'Present',
      color: 'hsl(var(--chart-1))',
    },
    absent: {
      label: 'Absent',
      color: 'hsl(var(--chart-2))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Attendance</CardTitle>
        <CardDescription>Today's attendance by department</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="department"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="present" fill="var(--color-present)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
