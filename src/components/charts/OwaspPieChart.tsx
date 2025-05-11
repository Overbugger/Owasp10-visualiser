"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ChartTooltipContent } from "../ui/chart";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

interface SeverityCounts {
  [key: string]: number;
}

interface Props {
  data: SeverityCounts;
}

const chartConfig = {
  HIGH: {
    color: "#C9001E",
    label: "High",
  },
  MEDIUM: {
    color: "#F69C00",
    label: "Medium",
  },
  LOW: {
    color: "#1E2B53",
    label: "Low",
  },
};

export function OwaspPieChart({ data }: Props) {
  const chartData = Object.entries(data).map(([severity, count]) => ({
    name: chartConfig[severity as keyof typeof chartConfig].label,
    value: count,
    color: chartConfig[severity as keyof typeof chartConfig].color,
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Severity Distribution</CardTitle>
        <CardDescription>
          Distribution of vulnerabilities by severity
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <Tooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="var(--chart-primary)"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
