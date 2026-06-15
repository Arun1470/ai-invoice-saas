import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    invoiceCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
