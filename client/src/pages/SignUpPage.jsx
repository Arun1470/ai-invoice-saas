import { SignUp } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-bold text-white text-xl">InvoiceAI</span>
      </div>
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-gray-900 border border-gray-800 shadow-2xl rounded-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700",
            formFieldLabel: "text-gray-400",
            formFieldInput: "bg-gray-800 border-gray-700 text-gray-100 focus:border-indigo-500",
            footerActionLink: "text-indigo-400 hover:text-indigo-300",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500",
          },
        }}
        redirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
