import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation, Link } from "wouter";
import { Activity } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) setLocation("/dashboard");
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex w-full max-w-md flex-col justify-center px-8 py-12 bg-white rounded-2xl shadow-xl shadow-slate-200/20">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">TeleDesk</h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Enterprise CMS</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-slate-900">Sign in to your account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Welcome back. Enter your credentials to access the portal.</p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
                <div className="mt-2">
                  <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium leading-6 text-slate-900">Password</label>
                  <div className="text-sm">
                    <Link href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                  </div>
                </div>
                <div className="mt-2">
                  <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={loading}>Sign in</Button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Need an account?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">Request access</Link>
          </div>
        </div>
      </div>


    </div>
  );
}
