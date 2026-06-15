import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Trash2, Edit3, Printer, CheckCircle, Clock, Send, XCircle, AlertCircle } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { invoiceAPI } from "../utils/api.js";
import { formatCurrency, formatDate, statusColor, statusLabel } from "../utils/format.js";
import toast from "react-hot-toast";

const STATUS_ACTIONS = [
  { status: "draft", icon: Edit3, label: "Mark Draft" },
  { status: "sent", icon: Send, label: "Mark Sent" },
  { status: "paid", icon: CheckCircle, label: "Mark Paid" },
  { status: "overdue", icon: AlertCircle, label: "Mark Overdue" },
  { status: "cancelled", icon: XCircle, label: "Cancel" },
];

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    invoiceAPI.getOne(id)
      .then((res) => setInvoice(res.data.invoice))
      .catch(() => toast.error("Invoice not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      const res = await invoiceAPI.update(id, { status });
      setInvoice(res.data.invoice);
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await invoiceAPI.delete(id);
      toast.success("Invoice deleted");
      navigate("/dashboard/invoices");
    } catch {
      toast.error("Failed to delete invoice");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="shimmer h-8 w-48 rounded-lg" />
        <div className="shimmer h-64 rounded-xl" />
        <div className="shimmer h-48 rounded-xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Invoice not found.</p>
        <button onClick={() => navigate("/dashboard/invoices")} className="btn-primary mt-4 mx-auto">Back to Invoices</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary p-2"><ArrowLeft size={16} /></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white font-mono">{invoice.invoiceNumber}</h1>
              {invoice.isAiGenerated && (
                <span className="badge bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles size={10} className="mr-1" /> AI Generated
                </span>
              )}
              <span className={`badge border ${statusColor(invoice.status)}`}>{statusLabel(invoice.status)}</span>
            </div>
            <p className="text-gray-400 text-sm mt-0.5">Issued {formatDate(invoice.issueDate)} · Due {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => window.print()} className="btn-secondary"><Printer size={15} /> Print</button>
          <button onClick={() => setConfirmDelete(true)} className="btn-danger"><Trash2 size={15} /> Delete</button>
        </div>
      </div>

      {/* Status actions */}
      <div className="card p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Update Status</p>
        <div className="flex gap-2 flex-wrap">
          {STATUS_ACTIONS.map(({ status, icon: Icon, label }) => (
            <button
              key={status}
              onClick={() => updateStatus(status)}
              disabled={invoice.status === status || updating}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border disabled:opacity-40 disabled:cursor-not-allowed ${
                invoice.status === status
                  ? `${statusColor(status)} opacity-100`
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
              }`}
            >
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice card */}
      <div className="card p-6 space-y-6 print-invoice">
        {/* Client + meta */}
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bill To</p>
            <p className="font-semibold text-white">{invoice.client?.name || "—"}</p>
            {invoice.client?.company && <p className="text-sm text-gray-400">{invoice.client.company}</p>}
            {invoice.client?.email && <p className="text-sm text-gray-400">{invoice.client.email}</p>}
            {invoice.client?.address && <p className="text-sm text-gray-400">{invoice.client.address}</p>}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Invoice</p>
            <p className="font-mono font-bold text-indigo-400 text-lg">{invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-400">Issued: {formatDate(invoice.issueDate)}</p>
            <p className="text-sm text-gray-400">Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line items */}
        <div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 text-xs text-gray-500 uppercase tracking-wider">Description</th>
                <th className="text-right py-2 text-xs text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="text-right py-2 text-xs text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="text-right py-2 text-xs text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="py-3 text-gray-200">{item.description}</td>
                  <td className="py-3 text-right text-gray-400">{item.quantity}</td>
                  <td className="py-3 text-right text-gray-400">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-3 text-right text-white font-medium">{formatCurrency(item.amount, invoice.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>{formatCurrency(invoice.subtotal, invoice.currency)}</span></div>
            {invoice.taxRate > 0 && (
              <div className="flex justify-between text-gray-400"><span>Tax ({invoice.taxRate}%)</span><span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span></div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-gray-400"><span>Discount</span><span>-{formatCurrency(invoice.discount, invoice.currency)}</span></div>
            )}
            <div className="flex justify-between font-bold text-white text-base border-t border-gray-700 pt-2">
              <span>Total</span><span>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            {invoice.notes && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-gray-400">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Terms</p>
                <p className="text-sm text-gray-400">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* AI Prompt used */}
        {invoice.isAiGenerated && invoice.aiPrompt && (
          <div className="border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Original AI Prompt</p>
            <p className="text-xs font-mono text-gray-500 bg-gray-800/60 rounded-lg p-3">{invoice.aiPrompt}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete ${invoice.invoiceNumber}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
