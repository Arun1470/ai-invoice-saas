import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, ArrowLeft, Plus, Trash2, Wand2 } from "lucide-react";
import { invoiceAPI } from "../utils/api.js";
import { formatCurrency } from "../utils/format.js";
import toast from "react-hot-toast";

const emptyItem = () => ({ description: "", quantity: 1, unitPrice: 0, amount: 0 });

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("ai"); // "ai" | "manual"
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    client: { name: "", email: "", company: "", address: "" },
    lineItems: [emptyItem()],
    taxRate: 0,
    discount: 0,
    currency: "USD",
    dueDate: "",
    notes: "",
    terms: "Payment due within 30 days.",
    status: "draft",
  });

  const updateField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateLineItem = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        items[index].amount = parseFloat(items[index].quantity || 0) * parseFloat(items[index].unitPrice || 0);
      }
      return { ...prev, lineItems: items };
    });
  };

  const addLineItem = () => setForm((p) => ({ ...p, lineItems: [...p.lineItems, emptyItem()] }));
  const removeLineItem = (i) => setForm((p) => ({ ...p, lineItems: p.lineItems.filter((_, idx) => idx !== i) }));

  const subtotal = form.lineItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const taxAmount = (subtotal * (parseFloat(form.taxRate) || 0)) / 100;
  const total = subtotal + taxAmount - (parseFloat(form.discount) || 0);

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt");
    setGenerating(true);
    try {
      const res = await invoiceAPI.aiGenerate(prompt);
      toast.success("Invoice generated with AI!");
      navigate(`/dashboard/invoices/${res.data.invoice._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleManualSave = async () => {
    if (!form.client.name) return toast.error("Client name is required");
    if (form.lineItems.some((i) => !i.description)) return toast.error("All line items need a description");
    setSaving(true);
    try {
      const res = await invoiceAPI.create({ ...form, subtotal, taxAmount, total });
      toast.success("Invoice created!");
      navigate(`/dashboard/invoices/${res.data.invoice._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const examplePrompts = [
    "Invoice Sarah at TechCorp for 15 hours of UI design at $85/hr and 3 hours of revisions at $60/hr. Add 8% GST. Due in 14 days.",
    "Bill John Smith for website development: homepage $1200, contact page $400, blog setup $600. Net 30 terms.",
    "Invoice Acme Ltd for monthly social media management $850 and ad campaign setup $350. 10% discount applied.",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary p-2">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">New Invoice</h1>
          <p className="text-gray-400 text-sm mt-0.5">Generate with AI or fill in manually</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
        {[{ id: "ai", label: "AI Generate", icon: Sparkles }, { id: "manual", label: "Manual", icon: Plus }].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === id ? "bg-indigo-600 text-white shadow" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* AI Mode */}
      {mode === "ai" && (
        <div className="card p-6 space-y-5">
          <div className="flex items-center gap-2 text-indigo-400">
            <Wand2 size={18} />
            <h2 className="font-semibold text-white">Describe your invoice</h2>
          </div>
          <p className="text-sm text-gray-400">
            Write a natural description of what you want to invoice. Include client name, services, rates, quantities, and any taxes or discounts.
          </p>
          <textarea
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Invoice John from Acme Corp for 20 hours of web design at $95/hr and 5 hours of consulting at $120/hr. Add 10% tax, due in 30 days."
            className="input resize-none font-mono text-sm"
          />

          {/* Example prompts */}
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Quick examples:</p>
            <div className="space-y-2">
              {examplePrompts.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(ex)}
                  className="w-full text-left text-xs text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 transition-all duration-150 line-clamp-1"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAIGenerate}
            disabled={generating || !prompt.trim()}
            className="btn-primary w-full justify-center py-3"
          >
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> Generating with Gemini AI...</>
            ) : (
              <><Sparkles size={16} /> Generate Invoice</>
            )}
          </button>
        </div>
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div className="space-y-5">
          {/* Client */}
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-white text-sm">Client Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Client Name *", path: "client.name", placeholder: "John Smith" },
                { label: "Email", path: "client.email", placeholder: "john@example.com" },
                { label: "Company", path: "client.company", placeholder: "Acme Corp" },
                { label: "Address", path: "client.address", placeholder: "123 Main St, City" },
              ].map(({ label, path, placeholder }) => (
                <div key={path}>
                  <label className="label">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={path.split(".").reduce((o, k) => o?.[k], form) || ""}
                    onChange={(e) => updateField(path, e.target.value)}
                    className="input"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Line Items */}
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-white text-sm">Line Items</h2>
            <div className="space-y-3">
              {form.lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    {i === 0 && <label className="label">Description</label>}
                    <input type="text" placeholder="Service or product" value={item.description} onChange={(e) => updateLineItem(i, "description", e.target.value)} className="input" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="label">Qty</label>}
                    <input type="number" min="0" value={item.quantity} onChange={(e) => updateLineItem(i, "quantity", e.target.value)} className="input" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="label">Unit $</label>}
                    <input type="number" min="0" value={item.unitPrice} onChange={(e) => updateLineItem(i, "unitPrice", e.target.value)} className="input" />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="label">Amount</label>}
                    <div className="input bg-gray-850 text-gray-300 cursor-default">{formatCurrency(item.amount)}</div>
                  </div>
                  <div className="col-span-1 flex items-end">
                    {i === 0 && <div className="label invisible">x</div>}
                    <button onClick={() => removeLineItem(i)} disabled={form.lineItems.length === 1} className="p-2 text-gray-600 hover:text-red-400 transition-colors disabled:opacity-30">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addLineItem} className="btn-secondary text-xs">
              <Plus size={14} /> Add Line Item
            </button>
          </div>

          {/* Totals & settings */}
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-white text-sm">Settings & Totals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="label">Tax Rate (%)</label>
                <input type="number" min="0" max="100" value={form.taxRate} onChange={(e) => updateField("taxRate", e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Discount ($)</label>
                <input type="number" min="0" value={form.discount} onChange={(e) => updateField("discount", e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">Currency</label>
                <select value={form.currency} onChange={(e) => updateField("currency", e.target.value)} className="input">
                  {["USD", "EUR", "GBP", "INR", "CAD", "AUD"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => updateField("dueDate", e.target.value)} className="input" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Any additional notes for the client..." className="input resize-none" />
              </div>
              <div>
                <label className="label">Terms</label>
                <textarea rows={3} value={form.terms} onChange={(e) => updateField("terms", e.target.value)} placeholder="Payment terms..." className="input resize-none" />
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-800 pt-4 space-y-2 text-sm">
              {[["Subtotal", formatCurrency(subtotal)], [`Tax (${form.taxRate}%)`, formatCurrency(taxAmount)], ["Discount", `-${formatCurrency(form.discount)}`]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-gray-400"><span>{l}</span><span>{v}</span></div>
              ))}
              <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-gray-800">
                <span>Total</span><span>{formatCurrency(total, form.currency)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button onClick={handleManualSave} disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : "Create Invoice"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
