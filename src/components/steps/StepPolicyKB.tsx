"use client";

import axios from "axios";
import { useClauseGuardStore } from "@/lib/store";
import { ClauseGuardAPI } from "@/lib/api";

interface StepPolicyKBProps {
  onNext: () => void;
}

export function StepPolicyKB({ onNext }: StepPolicyKBProps) {
  const { sessionId, policies, addPolicy, removePolicy, setIsLoading, setError, isLoading } =
    useClauseGuardStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => addPolicy(file));
    }
  };

  const handleNext = async () => {
    if (policies.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      await ClauseGuardAPI.uploadPolicies(sessionId, policies);
      setIsLoading(false);
      onNext();
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to upload policies to backend.");
      } else {
        setError("An unexpected error occurred while uploading policies.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-zinc-900">Policy Knowledge Base</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Upload your company standard policies (PDF, TXT, DOCX) to benchmark contracts against.
        </p>
      </div>

      {/* File Dropzone */}
      <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="policy-file-input"
          accept=".pdf,.txt,.docx"
        />
        <label htmlFor="policy-file-input" className="cursor-pointer block">
          <p className="text-sm font-medium text-zinc-700">
            Click to upload or drag and drop policies here
          </p>
          <p className="text-xs text-zinc-400 mt-1">PDF, TXT, or DOCX</p>
        </label>
      </div>

      {/* File List */}
      {policies.length > 0 && (
        <ul className="space-y-2">
          {policies.map((file, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm"
            >
              <span className="font-medium text-zinc-700 truncate max-w-md">{file.name}</span>
              <button
                onClick={() => removePolicy(idx)}
                className="text-red-500 hover:text-red-700 font-medium text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Next Step Action */}
      <button
        onClick={handleNext}
        disabled={policies.length === 0 || isLoading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full disabled:opacity-50 transition-colors"
      >
        {isLoading ? "Ingesting Policies..." : "Process & Continue to Contract Audit"}
      </button>
    </div>
  );
}