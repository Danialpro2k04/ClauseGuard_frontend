"use client";

import axios from "axios";
import { useClauseGuardStore } from "@/lib/store";
import { ClauseGuardAPI } from "@/lib/api";
import { FileText, AlertCircle } from "lucide-react";

interface StepContractAuditProps {
  onNext: () => void;
}

export function StepContractAudit({ onNext }: StepContractAuditProps) {
  const {
    sessionId,
    provider,
    modelName,
    apiKey,
    embeddingApiKey,
    contractFile,
    setContractFile,
    setReviewQueue,
    setAuditReport,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useClauseGuardStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContractFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAudit = async () => {
    if (!contractFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await ClauseGuardAPI.auditContract(
        sessionId,
        provider,
        modelName,
        apiKey,
        embeddingApiKey,
        contractFile
      );
      
      if (response.reviews) {
        setReviewQueue(response.reviews);
      }
      if (response.report) {
        setAuditReport(response.report);
      }

      setIsLoading(false);
      onNext();
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to analyze the contract.");
      } else {
        setError("An unexpected error occurred during the audit.");
      }
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-zinc-900">Contract Audit</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Upload the third-party contract you want to analyze against your Knowledge Base.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* File Dropzone */}
      <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="contract-file-input"
          accept=".pdf,.docx,.txt"
        />
        <label htmlFor="contract-file-input" className="cursor-pointer block">
          {contractFile ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <FileText className="w-8 h-8 text-blue-500" />
              <p className="text-sm font-medium text-zinc-900">{contractFile.name}</p>
              <p className="text-xs text-blue-600">Click to replace</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-zinc-700">
                Click to upload the contract file
              </p>
              <p className="text-xs text-zinc-400 mt-1">PDF, TXT, or DOCX</p>
            </>
          )}
        </label>
      </div>

      {/* Next Step Action */}
      <button
        onClick={handleAudit}
        disabled={!contractFile || isLoading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Analyzing Contract...
          </>
        ) : (
          "Run Compliance Audit"
        )}
      </button>
    </div>
  );
}