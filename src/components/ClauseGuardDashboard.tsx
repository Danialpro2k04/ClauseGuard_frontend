"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClauseGuardStore } from "@/lib/store";
import { StepConfiguration } from "./steps/StepConfiguration";
import { StepPolicyKB } from "./steps/StepPolicyKB";
import { StepContractAudit } from "./steps/StepContractAudit";
import { StepReviewQueue } from "./steps/StepReviewQueue";
import { CheckCircle2, Zap, FileText, BarChart3, CheckSquare } from "lucide-react";

const STEPS = [
  { number: 1, title: "Configuration", description: "Set up LLM provider", icon: Zap },
  { number: 2, title: "Policy KB", description: "Upload company policies", icon: FileText },
  { number: 3, title: "Contract Audit", description: "Analyze contract", icon: BarChart3 },
  { number: 4, title: "Review Queue", description: "Human-in-the-loop review", icon: CheckSquare },
];

export function ClauseGuardDashboard() {
  // Extract state and actions from our global Zustand store
  const { currentStep, setCurrentStep, sessionId, setSessionId, reset } = useClauseGuardStore();

  // Initialize sessionId on mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId, setSessionId]);

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleComplete = () => {
    setCurrentStep(5); // Step 5 now represents the "complete" state
  };

  const handleReset = () => {
    reset();
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-200/60 sticky top-0 z-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">
                ClauseGuard
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                AI-Powered Contract Compliance Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentStep === 5 ? (
          // Completion Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">
              Audit Workflow Complete!
            </h2>
            <p className="text-zinc-500 mb-8 max-w-md">
              All contract reviews have been processed successfully.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              Start New Audit
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Step Indicator with Icons */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/60 shadow-sm">
              <div className="flex justify-between items-center relative">
                {/* Connecting Line Background */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-zinc-200 rounded-full z-0" />
                
                {STEPS.map((step) => {
                  const isActive = step.number === currentStep;
                  const isCompleted = step.number < currentStep || currentStep === 5;
                  const Icon = step.icon;

                  return (
                    <div key={step.number} className="flex flex-col items-center flex-1 relative z-10">
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor: isActive
                            ? "#2563EB"
                            : isCompleted
                            ? "#18181B"
                            : "#E4E4E7",
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : isActive ? (
                          <Icon className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6 text-zinc-400" />
                        )}
                      </motion.div>

                      <div className="mt-4 text-center">
                        <p className={`text-sm font-bold ${isActive ? "text-blue-600" : isCompleted ? "text-zinc-900" : "text-zinc-400"}`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white p-8 rounded-3xl border border-zinc-200/60 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 1 && (
                    <StepConfiguration onNext={handleNextStep} />
                  )}
                  {currentStep === 2 && (
                    <StepPolicyKB onNext={handleNextStep} />
                  )}
                  {currentStep === 3 && (
                    <StepContractAudit onNext={handleNextStep} />
                  )}
                  {currentStep === 4 && (
                    <StepReviewQueue onComplete={handleComplete} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Info */}
            <div className="text-center text-xs text-zinc-400 font-medium">
              Step {currentStep === 5 ? 4 : currentStep} of {STEPS.length}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}