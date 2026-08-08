import { create } from "zustand";
import { Provider, ReviewItem, AuditReport } from "./types";

interface ClauseGuardStore {
  currentStep: number;
  sessionId: string;
  provider: Provider;
  modelName: string;
  apiKey: string;
  embeddingApiKey: string; // Separate OpenAI key used only for embeddings (policy ingest + retrieval), independent of the LLM provider/key chosen above
  policies: File[];
  contractFile: File | null;
  reviewQueue: ReviewItem[];
  auditReport: AuditReport | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  setSessionId: (id: string) => void;
  setProvider: (provider: Provider) => void;
  setModelName: (name: string) => void;
  setApiKey: (key: string) => void;
  setEmbeddingApiKey: (key: string) => void;
  setPolicies: (files: File[]) => void;
  addPolicy: (file: File) => void;
  removePolicy: (index: number) => void;
  setContractFile: (file: File | null) => void;
  setReviewQueue: (queue: ReviewItem[]) => void;
  removeReviewItem: (index: number) => void;
  setAuditReport: (report: AuditReport | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  sessionId: "",
  provider: "Groq" as Provider,
  modelName: "",
  apiKey: "",
  embeddingApiKey: "",
  policies: [] as File[],
  contractFile: null as File | null,
  reviewQueue: [] as ReviewItem[],
  auditReport: null as AuditReport | null,
  isLoading: false,
  error: null as string | null,
};

export const useClauseGuardStore = create<ClauseGuardStore>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  setSessionId: (id) => set({ sessionId: id }),
  setProvider: (provider) => set({ provider }),
  setModelName: (name) => set({ modelName: name }),
  setApiKey: (key) => set({ apiKey: key }),
  setEmbeddingApiKey: (key) => set({ embeddingApiKey: key }),
  setPolicies: (files) => set({ policies: files }),
  addPolicy: (file) => set((state) => ({ policies: [...state.policies, file] })),
  removePolicy: (index) =>
    set((state) => ({
      policies: state.policies.filter((_, i) => i !== index),
    })),
  setContractFile: (file) => set({ contractFile: file }),
  setReviewQueue: (queue) => set({ reviewQueue: queue }),
  removeReviewItem: (index) =>
    set((state) => ({
      reviewQueue: state.reviewQueue.filter((item) => item.index !== index),
    })),
  setAuditReport: (report) => set({ auditReport: report }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));