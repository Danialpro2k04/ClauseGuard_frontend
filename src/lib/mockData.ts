import { AuditReport, ReviewItem } from "./types";

export const mockAuditReport: AuditReport = {
  contract_name: "NDA_Agreement_2024.pdf",
  document_type: "Non-Disclosure Agreement",
  evaluations: [
    {
      clause_title: "Data Storage & Security",
      clause_text:
        "All confidential information shall be stored on standard cloud servers with standard encryption protocols.",
      retrieved_policy_context:
        "Company Policy: All data must be encrypted at rest using AES-256 or stronger, with encryption keys stored separately.",
      risk_level: "HIGH",
      justification:
        "The contract mentions 'standard encryption' which does not meet the company's requirement for AES-256 encryption.",
      recommendation:
        "Revise clause to explicitly require AES-256 encryption at rest with separate key storage.",
    },
    {
      clause_title: "Data Retention Period",
      clause_text:
        "Information will be retained for 2 years after the termination of this agreement.",
      retrieved_policy_context:
        "Company Policy: Sensitive data must be retained for at least 3 years to comply with regulatory requirements.",
      risk_level: "MEDIUM",
      justification:
        "2-year retention period does not meet the 3-year regulatory requirement specified in company policy.",
      recommendation:
        "Extend retention period to minimum 3 years or obtain regulatory exemption.",
    },
    {
      clause_title: "Breach Notification Timelines",
      clause_text:
        "In the event of a data breach, the receiving party will notify the disclosing party without unreasonable delay.",
      retrieved_policy_context:
        "Company Policy: Breach notification must occur within 24 hours of discovery.",
      risk_level: "HIGH",
      justification:
        "'Without unreasonable delay' is vague and does not meet the 24-hour requirement for critical incidents.",
      recommendation:
        "Specify '24 hours of discovery' for breach notification in the contract.",
    },
    {
      clause_title: "Access Control & Audit Trails",
      clause_text:
        "Each party may maintain reasonable access control measures as deemed appropriate.",
      retrieved_policy_context:
        "Company Policy: All data access must be logged with immutable audit trails; access restricted by role-based controls.",
      risk_level: "MEDIUM",
      justification:
        "Clause does not mandate audit trails or role-based access control as required by company policy.",
      recommendation:
        "Add requirement for immutable audit logging and role-based access controls with documentation.",
    },
    {
      clause_title: "Third-Party Subprocessors",
      clause_text: "Subcontractors may be used with prior written notice.",
      retrieved_policy_context:
        "Company Policy: No subprocessors allowed without explicit written approval and compliance audit.",
      risk_level: "MEDIUM",
      justification:
        "Clause allows subprocessors with just notice; company policy requires explicit approval and compliance audit.",
      recommendation:
        "Require explicit approval (not just notice) and annual compliance audits for any subprocessors.",
    },
  ],
};

export const mockReviewQueue: ReviewItem[] = [
  {
    index: 0,
    contract_name: "NDA_Agreement_2024.pdf",
    clause_title: "Data Storage & Security",
    clause_text:
      "All confidential information shall be stored on standard cloud servers with standard encryption protocols.",
    risk_level: "HIGH",
    justification:
      "The contract mentions 'standard encryption' which does not meet the company's requirement for AES-256 encryption.",
  },
  {
    index: 1,
    contract_name: "NDA_Agreement_2024.pdf",
    clause_title: "Breach Notification Timelines",
    clause_text:
      "In the event of a data breach, the receiving party will notify the disclosing party without unreasonable delay.",
    risk_level: "HIGH",
    justification:
      "'Without unreasonable delay' is vague and does not meet the 24-hour requirement for critical incidents.",
  },
];
