import Invoice from "../models/Invoice.js";
import { generateInvoiceFromPrompt } from "../utils/gemini.js";

// GET /api/invoices — get all invoices for current user
export const getInvoices = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.userId };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { "client.name": { $regex: search, $options: "i" } },
        { "client.company": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Invoice.countDocuments(filter);
    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, invoices, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/:id
export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.userId });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/invoices — create invoice manually
export const createInvoice = async (req, res) => {
  try {
    const invoiceData = { ...req.body, userId: req.userId };
    const invoice = await Invoice.create(invoiceData);
    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/invoices/ai-generate — generate invoice from prompt
export const generateInvoice = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const aiData = await generateInvoiceFromPrompt(prompt);
    const invoice = await Invoice.create({
      ...aiData,
      userId: req.userId,
      aiPrompt: prompt,
      isAiGenerated: true,
    });

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/invoices/:id
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/invoices/stats/summary
export const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const [total, paid, pending, overdue] = await Promise.all([
      Invoice.aggregate([{ $match: { userId } }, { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }]),
      Invoice.aggregate([{ $match: { userId, status: "paid" } }, { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }]),
      Invoice.aggregate([{ $match: { userId, status: { $in: ["sent", "draft"] } } }, { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }]),
      Invoice.aggregate([{ $match: { userId, status: "overdue" } }, { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }]),
    ]);

    res.json({
      success: true,
      stats: {
        total: { amount: total[0]?.total || 0, count: total[0]?.count || 0 },
        paid: { amount: paid[0]?.total || 0, count: paid[0]?.count || 0 },
        pending: { amount: pending[0]?.total || 0, count: pending[0]?.count || 0 },
        overdue: { amount: overdue[0]?.total || 0, count: overdue[0]?.count || 0 },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
