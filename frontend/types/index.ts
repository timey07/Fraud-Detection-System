export interface TransactionPayload {
  userId: string;
  amount: number;
  merchant: string;
  hour: number;
  deviceTrusted: boolean | number;
  geoDistance: number;
  velocity5m: number;
  merchantRisk: number;
}

export interface FraudAnalysisData {
  // IDs
  id?: string;
  transactionId?: string;
  transaction_id?: string;

  // Scores (camelCase)
  fraudProbability?: number;
  anomalyScore?: number;
  riskLevel?: string;

  // Scores (snake_case)
  fraud_probability?: number;
  anomaly_score?: number;
  risk_level?: string;

  // Decision
  decision?: string;

  // Reasons
  reasons?: string[];

  // Review
  reviewStatus?: string;
  review_status?: string;

  // Allow extra backend fields
  [key: string]: unknown;
}

export interface FraudResult {
  // Optional wrapper from backend
  message?: string;
  data?: FraudAnalysisData;

  // Flat fallback (if backend returns direct object)
  id?: string;
  transactionId?: string;
  transaction_id?: string;

  fraudProbability?: number;
  anomalyScore?: number;
  riskLevel?: string;

  fraud_probability?: number;
  anomaly_score?: number;
  risk_level?: string;

  decision?: string;
  reasons?: string[];

  reviewStatus?: string;
  review_status?: string;

  // Allow extra backend fields
  [key: string]: unknown;
}