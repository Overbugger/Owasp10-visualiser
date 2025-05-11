"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const messages = [
  "Cloning repository...",
  "Running OWASP scan...",
  "Setting up visualizations...",
];

export function LoadingMessages() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) =>
        prevIndex === messages.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <div className="text-2xl font-bold text-foreground min-w-[300px]">
            {messages[currentMessageIndex]}
          </div>
        </div>
        <div className="text-muted-foreground">
          Please wait while we analyze your repository
        </div>
      </div>
    </div>
  );
}
