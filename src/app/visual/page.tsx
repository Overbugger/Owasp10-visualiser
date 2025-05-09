"use client";

import { Key, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import vulnerabilityData from "@/data/j2.json";
import { OwaspAreaChart } from "@/components/charts/OwaspAreaChart";
import { OwaspPieChart } from "@/components/charts/OwaspPieChart";
import { Badge } from "@/components/ui/badge";
import AllGood from "@/components/AllGood";

export default function VisualizationPage() {
  const [selectedVulnerability, setSelectedVulnerability] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const severityCounts = vulnerabilityData.vulnerabilities.results.reduce(
    (acc, vuln: any) => {
      const severity =
        vuln.extra.severity === "ERROR"
          ? "HIGH"
          : vuln.extra.severity === "WARNING"
          ? "MEDIUM"
          : "LOW";
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { HIGH: 0, MEDIUM: 0, LOW: 0 }
  );

  const totalErrors = vulnerabilityData.vulnerabilities.results.length;

  interface severityType {
    [key: string]: string | React.ReactNode;
  }
  const severityColors: severityType = {
    HIGH: "bg-[#C9001E]/20 text-[#C9001E] border-[#C9001E]/50",
    MEDIUM: "bg-[#F69C00]/20 text-[#F69C00] border-[#F69C00]/50",
    LOW: "bg-[#1E2B53]/20 text-[#1E2B53] border-[#1E2B53]/50",
  };

  const severityIcons: severityType = {
    HIGH: (
      <AlertOctagon className="text-[#C9001E]" size={30} strokeWidth={2.75} />
    ),
    MEDIUM: (
      <AlertTriangle className="text-[#F69C00]" size={30} strokeWidth={2.75} />
    ),
    LOW: <Ban className="text-[#1E2B53]" size={30} strokeWidth={2.75} />,
  };

  const groupedVulnerabilities =
    vulnerabilityData.vulnerabilities.results.reduce((acc: any, vuln: any) => {
      const owasp = vuln.extra.metadata.owasp[0];
      if (!acc[owasp]) {
        acc[owasp] = [];
      }
      acc[owasp].push(vuln);
      return acc;
    }, {});

  const totalPages = selectedVulnerability
    ? Math.ceil(selectedVulnerability.length / itemsPerPage)
    : 0;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-28 md:mb-8">
        <Card className="bg-primary/20 rounded-t-lg border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium capitalize text-foreground">
              TOTAL
            </CardTitle>
            <ShieldAlert
              size={30}
              strokeWidth={2.75}
              className="text-primary"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="text-2xl font-bold text-foreground">
              {totalErrors}
            </div>
          </CardContent>
        </Card>
        {Object.entries(severityCounts).map(([severity, count]) => (
          <Card
            key={severity}
            className={`${severityColors[severity]} rounded-t-lg border`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium capitalize">
                {severity}
              </CardTitle>
              {severityIcons[severity]}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-9 lg:grid-cols-9 grid-cols-1 gap-3">
        <Tabs defaultValue="areachart" className="space-y-4 col-span-5 h-full">
          <TabsList className="border border-border">
            <TabsTrigger value="areachart">Area Chart</TabsTrigger>
            <TabsTrigger value="severitychart">Severity Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="areachart">
            <OwaspAreaChart />
          </TabsContent>

          <TabsContent value="severitychart">
            <OwaspPieChart />
          </TabsContent>
        </Tabs>
        <div className="grid grid-cols-1 col-span-4 gap-4">
          {Object.entries(groupedVulnerabilities).length < 1 ? (
            <AllGood />
          ) : (
            Object.entries(groupedVulnerabilities).map(
              ([owasp, vulns]: any) => {
                const highestSeverity = vulns.reduce(
                  (acc: string, vuln: { extra: { severity: string } }) => {
                    const severity =
                      vuln.extra.severity === "ERROR"
                        ? "HIGH"
                        : vuln.extra.severity === "WARNING"
                        ? "MEDIUM"
                        : "LOW";
                    return severity === "HIGH"
                      ? "HIGH"
                      : severity === "MEDIUM" && acc !== "HIGH"
                      ? "MEDIUM"
                      : acc;
                  },
                  "LOW"
                );

                return (
                  <Card key={owasp} className="flex item-center">
                    <div className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="grid grid-cols-12 gap-2">
                          <span className="col-span-2">
                            {severityIcons[highestSeverity]}
                          </span>
                          <span className="md:text-2xl text-xl col-span-10 md:col-span-8 text-foreground">
                            {owasp}
                          </span>
                          <span className="col-span-2">
                            <Badge className="text-sm" variant="secondary">
                              {vulns.length}
                            </Badge>
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="mb-2 text-primary/90">
                          {vulns[0].extra.metadata.cwe[0]}
                        </p>
                        <Button
                          className="w-50 bg-primary hover:bg-primary/90"
                          onClick={() => setSelectedVulnerability(vulns)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                );
              }
            )
          )}
        </div>
      </div>
      {selectedVulnerability && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center md:p-4">
          <Card className="w-full max-w-2xl md:h-[80vh] h-screen flex flex-col bg-card">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-foreground">
                <span>{selectedVulnerability[0].extra.metadata.owasp[0]}</span>
                <span className="text-sm font-normal text-muted-foreground text-nowrap">
                  {selectedVulnerability.length > 1 &&
                    `${currentPage} of ${totalPages}`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto scrollbar-hide">
              {selectedVulnerability
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((vuln: any, index: Key | null | undefined) => {
                  return (
                    <div
                      key={index}
                      className="mb-6 pb-6 border-b border-border last:border-b-0"
                    >
                      <h2 className="text-lg font-bold text-muted-foreground mb-2">
                        Description
                      </h2>
                      <p className="mb-4 text-foreground bg-muted p-2 rounded-md">
                        {vuln.extra.message}
                      </p>
                      <p className="mb-2 text-foreground">
                        <strong>Severity:</strong>{" "}
                        {vuln.extra.severity === "ERROR"
                          ? "HIGH"
                          : vuln.extra.severity === "WARNING"
                          ? "MEDIUM"
                          : "LOW"}
                      </p>
                      <p className="mb-2 text-foreground">
                        <strong>CWE:</strong>{" "}
                        {vuln.extra.metadata.cwe.join(", ")}
                      </p>
                      <p className="mb-2 text-foreground">
                        <strong>Check ID:</strong> {vuln.check_id}
                      </p>
                      <span className="mb-2">
                        <h2 className="text-lg font-bold text-muted-foreground mb-2">
                          Location
                        </h2>
                        <p className="text-foreground">
                          {" "}
                          <strong>path:</strong> {vuln.path}
                        </p>
                        <p className="text-foreground">
                          {" "}
                          <strong>From:</strong> Column {vuln.start.col}, Line{" "}
                          {vuln.start.line}
                        </p>
                        <p className="text-foreground">
                          {" "}
                          <strong>To:</strong> Column {vuln.end.col}, Line{" "}
                          {vuln.end.line}
                        </p>
                      </span>
                      <span className="mb-2">
                        <h2 className="text-lg font-bold text-muted-foreground mb-2 mt-4">
                          Mitigation
                        </h2>
                        <div className="flex flex-col gap-1">
                          {selectedVulnerability[0].extra.metadata.references.map(
                            (ref: string) => (
                              <a
                                href={ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                                key={ref}
                              >
                                {ref}
                              </a>
                            )
                          )}
                        </div>
                      </span>
                    </div>
                  );
                })}
            </CardContent>
            <div className="p-4 pt-0 flex justify-between items-center">
              {selectedVulnerability.length > 1 && (
                <Button
                  variant="ghost"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Prev
                </Button>
              )}

              <Button
                onClick={() => {
                  setCurrentPage(1);
                  setSelectedVulnerability(null);
                }}
                className="w-1/3 mx-auto bg-primary hover:bg-primary/90"
              >
                Done
              </Button>
              {selectedVulnerability.length > 1 && (
                <Button
                  variant="ghost"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
