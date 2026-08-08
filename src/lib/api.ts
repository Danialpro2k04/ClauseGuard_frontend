import axios from "axios";
import { useClauseGuardStore } from "./store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://clauseguard-backend.fastapicloud.dev";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const ClauseGuardAPI = {
  // Step 2: Upload Policy Documents
  // Embedding policy text now happens via OpenAI's embeddings API on the
  // backend (rather than a locally-loaded model), so this call needs an
  // OpenAI key too. Sent as an Authorization header, same reasoning as
  // auditContract below: form fields sit in the same body as uploaded
  // files and are more likely to be swept up by request-logging middleware
  // than a conventional Authorization header.
  uploadPolicies: async (sessionId: string, files: File[], embeddingApiKey: string) => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    files.forEach((file) => formData.append("files", file));

    const response = await apiClient.post("/api/v1/policies", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${embeddingApiKey}`,
      },
    });
    return response.data;
  },

  // Step 3: Audit Contract
  // Two separate keys travel with this request now: apiKey (the LLM
  // provider's key, used for intake/risk-scoring) and embeddingApiKey (an
  // OpenAI key, used for retrieval against the policy KB). They're kept
  // separate because the LLM provider the user picks (Groq, Anthropic,
  // etc.) may not be OpenAI, so the embedding key can't be assumed to be
  // the same as apiKey.
  auditContract: async (
    sessionId: string,
    provider: string,
    modelName: string,
    apiKey: string,
    embeddingApiKey: string,
    file: File
  ) => {
    const formData = new FormData();

    formData.append("session_id", sessionId);
    formData.append("provider", provider);
    formData.append("model_name", modelName);
    formData.append("embedding_api_key", embeddingApiKey);
    formData.append("file", file);
    // api_key is intentionally NOT appended to formData. The backend's
    // /api/v1/audit endpoint reads it from the Authorization header
    // instead of a multipart form field (form fields sit in the same
    // request body as the uploaded file and are more likely to be swept
    // up whole by request-logging middleware or proxy debug logs than a
    // conventional Authorization header is). embedding_api_key doesn't
    // have this same treatment since the backend expects it as a form
    // field, matching the current /api/v1/audit signature.

    const response = await apiClient.post("/api/v1/audit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  },

  // Step 4a: Get Pending Reviews (Replaces Streamlit load)
  getReviews: async () => {
    const response = await apiClient.get("/api/v1/reviews");
    return response.data;
  },

  // Step 4b: Resolve a Review (Replaces Streamlit buttons)
  // Takes the review's string id (a UUID) rather than its array index.
  // The backend used to store reviews in a JSON array and delete by
  // position, which was unsafe under concurrent requests (two clients
  // resolving different reviews near-simultaneously could each compute a
  // different array ordering and delete the wrong one). It's now backed by
  // SQLite with a stable UUID per record, and DELETE /api/v1/reviews/{id}
  // expects that UUID string, not a numeric index.
  resolveReview: async (reviewId: string) => {
    const response = await apiClient.delete(`/api/v1/reviews/${reviewId}`);
    return response.data;
  },
};