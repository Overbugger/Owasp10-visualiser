import { useMutation, useQuery } from "@tanstack/react-query";

interface AnalyzeRequest {
  gitUrl: string;
  ruleSet: "owasp" | "comprehensive";
}

export function useAnalyze() {
  const mutation = useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const response = await fetch(
        "https://semgrep-analyzer.onrender.com/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      return response.json();
    },
  });

  const useAnalyzeQuery = (data: AnalyzeRequest) => {
    return useQuery({
      queryKey: ["analyze", data.gitUrl],
      queryFn: () => mutation.mutateAsync(data),
      enabled: Boolean(data.gitUrl),
      staleTime: 60 * 60 * 1000,
    });
  };

  return {
    ...mutation,
    useQuery: useAnalyzeQuery,
  };
}
