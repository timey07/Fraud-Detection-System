// api/utils/decisionEngine.js

function getDecision(analysis) {
  const fraudProbability = analysis.fraud_probability;
  const anomalyScore = analysis.anomaly_score;
  const reasons = analysis.reasons || [];

  // 1. High confidence fraud → block immediately
  if (
    fraudProbability >= 0.75 ||
    (fraudProbability >= 0.55 && anomalyScore >= 0.65)
  ) {
    return "BLOCKED";
  }

  // 2. Suspicious behavior → flag for review
  if (
    fraudProbability >= 0.35 ||
    anomalyScore >= 0.55 ||
    reasons.includes("High transaction velocity")
  ) {
    return "FLAGGED";
  }

  // 3. Otherwise safe
  return "APPROVED";
}

export { getDecision };