import supabase from "../config/supabase.js";

// Existing function
async function saveTransaction(transaction, analysis, decision) {
  const payload = {
    user_id: transaction.userId,
    amount: transaction.amount,
    merchant: transaction.merchant,
    device_trusted: transaction.deviceTrusted,
    geo_distance: transaction.geoDistance,
    velocity_5m: transaction.velocity5m,

    fraud_probability: analysis.fraud_probability,
    anomaly_score: analysis.anomaly_score,
    risk_level: analysis.risk_level,
    reasons: analysis.reasons,

    decision,
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert([payload])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// NEW: Fetch all transactions
async function getAllTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// NEW: Fetch one transaction by ID
async function getTransactionById(id) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// NEW: Update analyst review fields
async function updateTransactionReview(id, reviewData) {
  const updates = {
    review_status: reviewData.review_status,
    analyst_note: reviewData.analyst_note,
  };

  // optional decision override
  if (reviewData.decision) {
    updates.decision = reviewData.decision;
  }

  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export {
  saveTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionReview,
};