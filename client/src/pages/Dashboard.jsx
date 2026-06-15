import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { DollarSign, FileText, Clock, AlertCircle, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import InvoiceRow from "../components/InvoiceRow.jsx";
import { StatCardSkeleton, InvoiceTableSkeleton } from "../components/Skeleton.jsx";
import { invoiceAPI } from "../utils/api.js";
import { formatCurrency } from "../utils/format.js";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, invoicesRes] = await Promise.all([
          invoiceAPI.getStats(),
          invoiceAPI.getAll({ limit: 5, page: 1 }),
        ]);
        setStats(statsRes.data.stats);
        setRecentInvoices(invoicesRes.data.invoices);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, {user?.firstName || "there"} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's what's happening with your invoices.</p>
        </div>
        <button onClick={() => navigate("/dashboard/invoices/new")} className="btn-primary">
          <Sparkles size={16} />
          New Invoice
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.total?.amount || 0)}
              subtitle={`${stats?.total?.count || 0} invoices total`}
              icon={TrendingUp}
              color="indigo"
            />
            <StatCard
              title="Paid"
              value={formatCurrency(stats?.paid?.amount || 0)}
              subtitle={`${stats?.paid?.count || 0} paid invoices`}
              icon={DollarSign}
              color="emerald"
            />
            <StatCard
              title="Pending"
              value={formatCurrency(stats?.pending?.amount || 0)}
              subtitle={`${stats?.pending?.count || 0} outstanding`}
              icon={Clock}
              color="amber"
            />
            <StatCard
              title="Overdue"
              value={formatCurrency(stats?.overdue?.amount || 0)}
              subtitle={`${stats?.overdue?.count || 0} overdue`}
              icon={AlertCircle}
              color="red"
            />
          </>
        )}
      </div>

      {/* AI Prompt CTA */}
      <div className="card p-6 border-indigo-500/20 bg-gradient-to-r from-indigo-950/50 to-purple-950/50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles size={22} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Generate with AI</h3>
              <p className="text-sm text-gray-400">Describe your work in plain English — get a complete invoice in seconds.</p>
            </div>
          </div>
          <button onClick={() => navigate("/dashboard/invoices/new")} className="btn-primary whitespace-nowrap">
            Try it now <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-400" />
            <h2 className="font-semibold text-white text-sm">Recent Invoices</h2>
          </div>
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {loading ? (
          <InvoiceTableSkeleton />
        ) : recentInvoices.length === 0 ? (
          <div className="py-12 text-center">
            <FileText size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No invoices yet. Create your first one!</p>
            <button onClick={() => navigate("/dashboard/invoices/new")} className="btn-primary mt-4 mx-auto">
              <Sparkles size={14} /> Generate Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800/60">
                  {["Invoice", "Client", "Issued", "Due", "Status", "Amount", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <InvoiceRow key={inv._id} invoice={inv} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
