"use client";

import { useEffect, useState } from "react";
import { ClauseGuardAPI } from "@/lib/api";
import { CheckCircle, AlertTriangle, Check } from "lucide-react";

interface StepReviewQueueProps {
  onComplete: () => void;
}

interface ReviewItem {
  id: string; // stable UUID from review_store.py — used for resolve/delete, not array position
  contract_name: string;
  risk_level: string;
  clause_text: string;
  justification: string;
  status?: string;
  session_id?: string;
  created_at?: string;
}

export function StepReviewQueue({ onComplete }: StepReviewQueueProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Load: Defined entirely inside the useEffect
  useEffect(() => {
    let isMounted = true;

    const fetchInitialReviews = async () => {
      try {
        const data = await ClauseGuardAPI.getReviews();
        if (isMounted) setReviews(data || []);
      } catch (err) {
        if (isMounted) setError("Failed to fetch pending reviews.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialReviews();

    return () => {
      isMounted = false;
    };
  }, []); // Clean dependency array — linter will be happy!

  // 2. Resolve Action: keyed by the review's stable id, not its position in
  // the array. The backend used to store reviews in a flat JSON array and
  // delete by index; that broke under concurrent resolves (two people
  // resolving different rows near-simultaneously could each compute a
  // different index for the same row and delete the wrong one). It's now
  // SQLite-backed with a UUID per row, and DELETE /api/v1/reviews/{id}
  // expects that UUID — passing an array index here would 404.
  const handleResolve = async (reviewId: string) => {
    try {
      // Optimistically remove from UI
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      await ClauseGuardAPI.resolveReview(reviewId);
    } catch (err) {
      setError("Failed to resolve. Re-syncing with backend...");
      setIsLoading(true);
      
      // Fallback: Fetch directly here instead of calling a shared function
      try {
        const data = await ClauseGuardAPI.getReviews();
        setReviews(data || []);
      } catch (fallbackErr) {
        setError("Critcal error syncing with backend.");
      } finally {
        setIsLoading(false);
      }
    }
  };

// ... keep the rest of your return statements the exact same

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4" />
        <p className="text-zinc-500 font-medium">Loading Human-in-the-Loop Review Queue...</p>
      </div>
    );
  }

  // If the queue is empty, the contract is fully resolved!
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-zinc-900 mb-2">Queue Empty!</h3>
        <p className="text-zinc-500 mb-8 max-w-sm">
          All clauses have been reviewed and resolved. The contract is cleared.
        </p>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
        >
          Finish Audit Session
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-zinc-900">Review Queue</h3>
        <p className="text-sm text-zinc-500 mt-1">
          Review the clauses flagged by the LLM. Mark them as resolved to clear the queue.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* List of flagged items */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {reviews.map((item) => (
          <div key={item.id} className="p-5 border border-zinc-200 rounded-2xl bg-zinc-50/50 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  item.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                  item.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  item.risk_level === 'UNVERIFIED' ? 'bg-zinc-200 text-zinc-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.risk_level} RISK
                </span>
                <span className="text-sm text-zinc-500 ml-3">{item.contract_name}</span>
              </div>
              <button
                onClick={() => handleResolve(item.id)}
                className="px-4 py-2 bg-white border border-zinc-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Resolve
              </button>
            </div>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-zinc-700 block mb-1">Clause Text:</span>
                <p className="text-zinc-600 bg-white p-3 rounded-lg border border-zinc-200">
                  {item.clause_text || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-blue-50/50 text-blue-900 rounded-xl border border-blue-100">
                <span className="font-semibold block mb-1">Justification:</span>
                {item.justification || "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}