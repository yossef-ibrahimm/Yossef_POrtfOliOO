import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LoadingPage from "@/components/LoadingPage";
import BlockReveal from "@/components/BlockReveal";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showBlockReveal, setShowBlockReveal] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowBlockReveal(true);
  };

  const handleRevealComplete = () => {
    setShowBlockReveal(false);
    setShowContent(true);
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }} basename="/Yossef_POrtfOliOO/"
          >
            {/* Loading Page */}
            <AnimatePresence mode="wait">
              {isLoading && (
                <LoadingPage onLoadingComplete={handleLoadingComplete} />
              )}
            </AnimatePresence>

            {/* Block Reveal Animation */}
            <AnimatePresence mode="wait">
              {showBlockReveal && (
                <BlockReveal onComplete={handleRevealComplete} />
              )}
            </AnimatePresence>

            {/* Main Content */}
            {showContent && (
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
