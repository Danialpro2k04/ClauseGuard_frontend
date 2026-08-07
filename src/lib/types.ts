export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type Provider = "Groq" | "OpenAI" | "Anthropic";

export interface ClauseEvaluation {
  clause_title: string;
  clause_text: string;
  retrieved_policy_context: string;
  risk_level: RiskLevel;
  justification: string;
  recommendation: string;
}

export interface AuditReport {
  contract_name: string;
  document_type: string;
  evaluations: ClauseEvaluation[];
}

export interface ReviewItem {
  index: number;
  contract_name: string;
  clause_text: string;
  clause_title: string;
  risk_level: RiskLevel;
  justification: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
