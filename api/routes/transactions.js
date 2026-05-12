import express from "express";
import { scoreTransaction } from "../services/mlService.js";
import { getDecision } from "../utils/decisionEngine.js";
import {
  saveTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionReview,
} from "../services/transactionService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      amount,
      merchant,
      deviceTrusted,
      geoDistance,
      velocity5m
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      amount === undefined ||
      !merchant ||
      deviceTrusted === undefined ||
      geoDistance === undefined ||
      velocity5m === undefined
    ) {
      return res.status(400).json({
        error: "Missing required transaction fields"
      });
    }

    // Build transaction object
    const transaction = {
      userId,
      amount,
      merchant,
      deviceTrusted,
      geoDistance,
      velocity5m
    };

    // Step 1: Score transaction using ML service
    const analysis = await scoreTransaction(transaction);

    // Step 2: Convert ML output into business decision
    const decision = getDecision(analysis);

    // Step 3: Save transaction + analysis + decision to DB
    const savedTransaction = await saveTransaction(
      transaction,
      analysis,
      decision
    );

    // Step 4: Return persisted record
    return res.status(200).json({
      message: "Transaction scored successfully",
      data: savedTransaction
    });
  } catch (error) {
    console.error("Transaction route error:", error.message);

    return res.status(500).json({
      error: error.message || "Internal server error"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const transactions = await getAllTransactions();

    res.json({
      message: "Transactions fetched successfully",
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);

    res.status(500).json({
      error: "Failed to fetch transactions",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await getTransactionById(id);

    res.json({
      message: "Transaction fetched successfully",
      data: transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error.message);

    res.status(500).json({
      error: "Failed to fetch transaction",
    });
  }
});

router.patch("/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const reviewData = req.body;

    const updatedTransaction = await updateTransactionReview(id, reviewData);

    res.json({
      message: "Transaction review updated successfully",
      data: updatedTransaction,
    });
  } catch (error) {
    console.error("Error updating transaction review:", error.message);

    res.status(500).json({
      error: "Failed to update transaction review",
    });
  }
});

export default router;