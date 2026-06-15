import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Sparkles, Search, Filter } from "lucide-react";
import InvoiceRow from "../components/InvoiceRow.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { InvoiceTableSkeleton } from "../components/Skeleton.jsx";
import { invoiceAPI } from "../utils/api.js";
import toast from "react-hot-toast";

const STATUSES = ["all", "draft", "sent", "paid", "overdue", "cancelled"];

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (status !== "all") params.status = status;
      const res = await invoiceAPI.getAll(params);
      setInvoices(res.data.invoices);
      setTotalPages(res.data.pages);
    } catch {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search, status]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage and track all your invoices</p>
        </div>
        <button onClick={() => navigate("/dashboard/invoices/new")} className="btn-primary">
          <Sparkles size={16} /> New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-500 flex-shrink-0" />
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-150 ${
                  status === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <InvoiceTableSkeleton />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={search || status !== "all" ? "Try adjusting your search or filters." : "Create your first invoice using AI."}
            action={
              !search && status === "all" && (
                <button onClick={() => navigate("/dashboard/invoices/new")} className="btn-primary mx-auto">
                  <Sparkles size={14} /> Generate with AI
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-800/60">
                    {["Invoice", "Client", "Issued", "Due", "Status", "Amount", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => <InvoiceRow key={inv._id} invoice={inv} />)}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary py-1.5 text-xs disabled:opacity-40">
                    Previous
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary py-1.5 text-xs disabled:opacity-40">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
