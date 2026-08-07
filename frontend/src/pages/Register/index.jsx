import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, ArrowLeft } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { authService } from "@/services/authService";

export default function Register() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(form.name, form.email, form.password, form.phone);
      setLocation("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm mb-4">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">Request portal access</h2>
          <p className="text-center text-sm text-slate-500 mt-2">Fill out the form below to create your account.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Full Name</label>
            <Input name="name" type="text" required placeholder="John Doe" className="mt-2" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Email</label>
            <Input name="email" type="email" required placeholder="john@telecom.com" className="mt-2" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Phone Number (10 digits)</label>
            <Input name="phone" type="tel" placeholder="9876543210" className="mt-2" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Password</label>
            <Input name="password" type="password" required placeholder="Min. 8 characters" className="mt-2" value={form.password} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full mt-6" size="lg" isLoading={loading}>Create Account</Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
