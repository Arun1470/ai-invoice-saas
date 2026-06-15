import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  FileText,
  Users,
  Sparkles,
  ChevronRight,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/dashboard/invoices", icon: FileText, label: "Invoices" },
  { to: "/dashboard/clients", icon: Users, label: "Clients" },
];

export default function Layout() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">InvoiceAI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"} />
                  {label}
                  {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
                </>
              )}
            </NavLink>
          ))}

          {/* AI Generate CTA */}
          <div className="pt-4">
            <button
              onClick={() => navigate("/dashboard/invoices/new")}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all duration-200 active:scale-95"
            >
              <Sparkles size={16} />
              Generate Invoice
            </button>
          </div>
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {user?.fullName || user?.firstName || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 md:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
