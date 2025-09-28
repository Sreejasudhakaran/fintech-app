import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CustomPieChartProps {
  data: PieChartData[];
}

const COLORS = [
  'hsl(158 64% 52%)', // primary
  'hsl(186 81% 29%)', // secondary  
  'hsl(188 78% 41%)', // accent
  'hsl(42 70% 58%)',  // warning
  'hsl(0 84% 60%)',   // destructive
];

export function CustomPieChart({ data }: CustomPieChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
            labelFormatter={(label) => `Category: ${label}`}
          />
          <Legend 
            formatter={(value) => value}
            wrapperStyle={{ fontSize: '14px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
