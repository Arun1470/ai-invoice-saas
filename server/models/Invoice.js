import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unitPrice: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    // Removed required:true so auto-generation can work
    invoiceNumber: { type: String },

    client: {
      name: String,
      email: String,
      company: String,
      address: String,
    },

    lineItems: [lineItemSchema],

    subtotal: { type: Number, required: true },

    taxRate: { type: Number, default: 0 },

    taxAmount: { type: Number, default: 0 },

    discount: { type: Number, default: 0 },

    total: { type: Number, required: true },

    currency: { type: String, default: "USD" },

    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },

    dueDate: { type: Date },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
    },

    terms: {
      type: String,
      default: "",
    },

    aiPrompt: {
      type: String,
      default: "",
    },

    isAiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number
invoiceSchema.pre("save", async function (next) {
  try {
    if (!this.invoiceNumber) {
      const count = await mongoose
        .model("Invoice")
        .countDocuments({ userId: this.userId });

      this.invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;