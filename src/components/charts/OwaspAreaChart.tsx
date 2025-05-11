"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalysisResponse {
  vulnerabilities: {
    results: Array<{
      path: string;
      extra: {
        severity: "ERROR" | "WARNING" | "INFO";
      };
    }>;
    paths: {
      scanned: string[];
    };
  };
}

interface Props {
  data: AnalysisResponse;
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

export function OwaspAreaChart({ data }: Props) {
  // Group vulnerabilities by file
  const groupedByFile = data.vulnerabilities.results.reduce(
    (acc: Record<string, Record<string, number>>, vuln) => {
      const file = vuln.path.split("/").pop() || vuln.path;
      const severity =
        vuln.extra.severity === "ERROR"
          ? "HIGH"
          : vuln.extra.severity === "WARNING"
          ? "MEDIUM"
          : "LOW";

      if (!acc[file]) {
        acc[file] = { HIGH: 0, MEDIUM: 0, LOW: 0 };
      }

      acc[file][severity]++;
      return acc;
    },
    {}
  );

  // Convert to chart data format
  const chartData = Object.entries(groupedByFile).map(([file, counts]) => ({
    name: file,
    ...counts,
  }));

  return (
    <Card>
      <CardHeader className="flex flex-col items-center pb-2">
        <CardTitle>Vulnerability Distribution by File</CardTitle>
        <CardDescription>
          Number of vulnerabilities per file by severity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full aspect-[4/3]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 15,
              }}
            >
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="HIGH"
                stackId="1"
                stroke={chartConfig.HIGH.color}
                fill={chartConfig.HIGH.color}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="MEDIUM"
                stackId="1"
                stroke={chartConfig.MEDIUM.color}
                fill={chartConfig.MEDIUM.color}
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="LOW"
                stackId="1"
                stroke={chartConfig.LOW.color}
                fill={chartConfig.LOW.color}
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
