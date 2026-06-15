import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Clerk user ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
