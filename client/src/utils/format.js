export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const statusColor = (status) => {
  const map = {
    draft: "bg-gray-700/50 text-gray-300 border-gray-600",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-gray-700/30 text-gray-500 border-gray-700",
  };
  return map[status] || map.draft;
};

export const statusLabel = (status) => {
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Draft";
};
