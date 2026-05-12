import axios from "axios";

export const scoreTransaction = async (transaction) => {
  try {
    const payload = {
      amount: transaction.amount,
      hour: new Date().getHours(),
      device_trusted: transaction.deviceTrusted,
      geo_distance: transaction.geoDistance,
      velocity_5m: transaction.velocity5m,
      merchant_risk: 0.8
    };

    const response = await axios.post(process.env.ML_SERVICE_URL, payload);

    return response.data;
  } catch (error) {
    console.error("ML Service error:", error.message);
    throw new Error("Failed to fetch prediction from ML service");
  }
};