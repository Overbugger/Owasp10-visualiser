"use client";

import { OwaspTenAccordion } from "../components/OwaspTenAccordion";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { getAnalysisData, FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

function isValidGitHubRepoLink(url: string) {
  const githubRepoPattern = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\.git$/;
  return githubRepoPattern.test(url);
}

function SubmitButton({ loading }: { loading: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={loading}
      className="bg-primary hover:bg-primary/90 min-w-[100px]"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Scanning...</span>
        </div>
      ) : (
        "Scan"
      )}
    </Button>
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [state, formAction] = useFormState<FormState, FormData>(
    getAnalysisData,
    {
      message: "",
    }
  );
  const [clientError, setClientError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError("");
    setIsLoading(true);

    if (!isValidGitHubRepoLink(input)) {
      setClientError(
        "Please enter a valid GitHub repository URL ending with .git (e.g., https://github.com/username/repo.git)."
      );
      setIsLoading(false);
      return;
    }
    const formData = new FormData(e.currentTarget);
    formAction(formData);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col md:flex-row">
      <div className="md:w-2/5 hidden md:block bg-gradient-to-b from-primary/20 to-primary/10 px-5 py-2">
        <h1 className="text-center m-3 font-bold text-xl text-foreground">
          Top 10 Web Application Security Risks
        </h1>
        <OwaspTenAccordion />
      </div>
      <div className="md:w-3/5 w-full md:h-screen flex flex-col md:my-12 p-5 gap-10">
        <div className="flex flex-col items-start md:items-center gap-3 mt-20">
          <div className="md:text-5xl text-4xl text-center font-extrabold text-foreground mb-4">
            Visualize your Codebase
          </div>
          <div className="text-lg text-muted-foreground text-center max-w-xl">
            Provide the git link to the codebase to receive a comprehensive
            visual analysis of potential OWASP Top 10 vulnerabilities.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex justify-center gap-3">
          <div>
            <Input
              id="repo-url"
              name="input"
              type="url"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setClientError("");
              }}
              placeholder="https://github.com/username/repo.git"
              className="mb-2"
            />
          </div>
          <SubmitButton loading={isLoading} />
        </form>
        {clientError && (
          <Alert variant="destructive" className="mt-2 w-full md:w-1/2">
            <AlertDescription>{clientError}</AlertDescription>
          </Alert>
        )}
        {state.error && (
          <Alert variant="destructive" className="mt-2 w-full md:w-1/2">
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.message && (
          <Alert
            variant="default"
            className="mt-2 bg-primary/10 text-primary border-primary/20 w-full md:w-1/2"
          >
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  );
}
