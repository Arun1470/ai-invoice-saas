import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Zap, Sparkles, Shield, BarChart3, Users, FileText, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI-Powered Generation", desc: "Describe your work in plain English and get a professional invoice instantly using Gemini AI." },
  { icon: Users, title: "Client Management", desc: "Store client details, track billing history, and manage relationships in one place." },
  { icon: BarChart3, title: "Payment Tracking", desc: "Monitor paid, pending, and overdue invoices with a real-time dashboard." },
  { icon: Shield, title: "Secure by Default", desc: "Enterprise-grade auth via Clerk. Your data is encrypted and private." },
];

const perks = ["No credit card to start", "Unlimited clients", "AI invoice generation", "Export to PDF", "Secure Clerk auth", "Real-time dashboard"];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">InvoiceAI</span>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <button onClick={() => navigate("/dashboard")} className="btn-primary">
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/sign-in")} className="btn-secondary">Sign In</button>
                <button onClick={() => navigate("/sign-up")} className="btn-primary">Get Started <ArrowRight size={16} /></button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <Sparkles size={12} />
          Powered by Gemini AI
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Create invoices from{" "}
          <span className="gradient-text">natural language</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Just describe what you did. InvoiceAI turns your plain-English description into a professional, itemised invoice in seconds.
        </p>

        {/* Prompt demo box */}
        <div className="card p-4 max-w-2xl mx-auto mb-10 text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Try saying something like:</p>
          <p className="text-gray-300 text-sm font-mono leading-relaxed">
            "Invoice John from Acme Corp for 20 hours of web design at $95/hr, 5 hours of consulting at $120/hr, plus 10% tax. Due in 30 days."
          </p>
          <div className="mt-3 flex items-center gap-2 text-indigo-400 text-xs font-medium">
            <Sparkles size={12} />
            AI generates a complete invoice instantly
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button onClick={() => navigate("/sign-up")} className="btn-primary px-6 py-3 text-base">
            Start for free <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate("/sign-in")} className="btn-secondary px-6 py-3 text-base">
            Sign in
          </button>
        </div>
      </section>

      {/* Perks */}
      <section className="py-8 px-6 border-y border-gray-800/60 bg-gray-900/40">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle size={14} className="text-emerald-400" />
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything you need to invoice smarter</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 hover:border-gray-700 transition-colors duration-200 group">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <Icon size={18} className="text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="card p-12 max-w-2xl mx-auto border-indigo-500/20">
          <FileText size={36} className="text-indigo-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get paid faster?</h2>
          <p className="text-gray-400 mb-8">Join freelancers and agencies who invoice smarter with AI.</p>
          <button onClick={() => navigate("/sign-up")} className="btn-primary px-8 py-3 text-base mx-auto">
            Create your first invoice <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
            <Zap size={12} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">InvoiceAI</span>
        </div>
        <p className="text-xs text-gray-600">Built with React · Node.js · MongoDB · Gemini AI · Clerk</p>
      </footer>
    </div>
  );
}
