import React, { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { InstallPrompt } from "@/components/InstallPrompt";
import { LoadingScreen } from "@/components/loading-screen";

import ErrorBoundary from "@/components/error-boundary";
import Router from "@/Router";

import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen />}>
            <TooltipProvider>
              <Toaster />
              <InstallPrompt />
              <Router />
            </TooltipProvider>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
