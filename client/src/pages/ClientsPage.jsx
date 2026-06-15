import { useState, useEffect } from "react";
import { Users, Plus, Mail, Phone, Building2, Pencil, Trash2, X, Loader2 } from "lucide-react";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { clientAPI } from "../utils/api.js";
import toast from "react-hot-toast";

const emptyForm = { name: "", email: "", phone: "", company: "", address: "", city: "", country: "", currency: "USD" };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await clientAPI.getAll();
      setClients(res.data.clients);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingClient(null); setShowModal(true); };
  const openEdit = (c) => { setForm(c); setEditingClient(c); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingClient(null); };

  const handleSave = async () => {
    if (!form.name || !form.email) return toast.error("Name and email are required");
    setSaving(true);
    try {
      if (editingClient) {
        const res = await clientAPI.update(editingClient._id, form);
        setClients((prev) => prev.map((c) => c._id === editingClient._id ? res.data.client : c));
        toast.success("Client updated");
      } else {
        const res = await clientAPI.create(form);
        setClients((prev) => [res.data.client, ...prev]);
        toast.success("Client added");
      }
      closeModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await clientAPI.delete(deleteTarget._id);
      setClients((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      toast.success("Client deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete client");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400 text-sm mt-0.5">{clients.length} client{clients.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Client</button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="shimmer h-4 w-32 rounded" />
              <div className="shimmer h-3 w-48 rounded" />
              <div className="shimmer h-3 w-36 rounded" />
            </div>
          ))}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add your first client to get started managing billing relationships."
          action={<button onClick={openCreate} className="btn-primary mx-auto"><Plus size={14} /> Add Client</button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div key={client._id} className="card p-5 hover:border-gray-700 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-sm">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(client)} className="p-1.5 text-gray-500 hover:text-gray-200 rounded-lg hover:bg-gray-800 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(client)} className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-0.5">{client.name}</h3>
              {client.company && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Building2 size={11} />{client.company}
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Mail size={11} />{client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Phone size={11} />{client.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative card p-6 w-full max-w-lg animate-slide-up shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{editingClient ? "Edit Client" : "Add Client"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-300 transition-colors"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name *", key: "name", placeholder: "John Smith", colSpan: 2 },
                { label: "Email *", key: "email", placeholder: "john@example.com", colSpan: 2 },
                { label: "Phone", key: "phone", placeholder: "+1 555 0000" },
                { label: "Company", key: "company", placeholder: "Acme Corp" },
                { label: "Address", key: "address", placeholder: "123 Main St", colSpan: 2 },
                { label: "City", key: "city", placeholder: "New York" },
                { label: "Country", key: "country", placeholder: "USA" },
              ].map(({ label, key, placeholder, colSpan }) => (
                <div key={key} className={colSpan === 2 ? "col-span-2" : ""}>
                  <label className="label">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key] || ""}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="input"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : (editingClient ? "Update" : "Add Client")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Client"
        message={`Delete ${deleteTarget?.name}? Their invoice history will remain but they won't appear in your client list.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
