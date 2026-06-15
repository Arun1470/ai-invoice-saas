import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, statusColor, statusLabel } from "../utils/format.js";
import { ExternalLink } from "lucide-react";

export default function InvoiceRow({ invoice }) {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b border-gray-800/60 hover:bg-gray-800/40 cursor-pointer transition-colors duration-150 group"
      onClick={() => navigate(`/dashboard/invoices/${invoice._id}`)}
    >
      <td className="px-4 py-3.5">
        <span className="font-mono text-sm text-indigo-400">{invoice.invoiceNumber}</span>
      </td>
      <td className="px-4 py-3.5">
        <div>
          <p className="text-sm font-medium text-gray-200">{invoice.client?.name || "—"}</p>
          {invoice.client?.company && (
            <p className="text-xs text-gray-500">{invoice.client.company}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-400">{formatDate(invoice.issueDate)}</td>
      <td className="px-4 py-3.5 text-sm text-gray-400">{formatDate(invoice.dueDate)}</td>
      <td className="px-4 py-3.5">
        <span className={`badge border ${statusColor(invoice.status)}`}>
          {statusLabel(invoice.status)}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <span className="text-sm font-semibold text-white">
          {formatCurrency(invoice.total, invoice.currency)}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <ExternalLink size={14} className="text-gray-600 group-hover:text-gray-400 ml-auto transition-colors" />
      </td>
    </tr>
  );
}
