import express from "express";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  generateInvoice,
  updateInvoice,
  deleteInvoice,
  getStats,
} from "../controllers/invoiceController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/stats/summary", getStats);
router.get("/", getInvoices);
router.get("/:id", getInvoice);
router.post("/", createInvoice);
router.post("/ai-generate", generateInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
