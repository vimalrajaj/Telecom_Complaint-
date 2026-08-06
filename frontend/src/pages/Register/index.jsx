import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, ArrowLeft } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function Register() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation("/login");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm mb-4">
            <Activity className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
            Request portal access
          </h2>
          <p className="text-center text-sm text-slate-500 mt-2">
            Fill out the form below. Your manager will approve your request.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Full Name</label>
            <Input type="text" required placeholder="Aarav Sharma" className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Work Email</label>
            <Input type="email" required placeholder="aarav.sharma@telecom.com" className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Phone Number</label>
            <Input type="tel" required placeholder="+1 (555) 000-0000" className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Role</label>
            <select className="mt-2 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600">
              <option value="customer_support">Customer Support Agent</option>
              <option value="field_engineer">Field Engineer</option>
              <option value="manager">Operations Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium leading-6 text-slate-900">Password</label>
            <Input type="password" required placeholder="Create a strong password" className="mt-2" />
          </div>
          <Button type="submit" className="w-full mt-6" size="lg" isLoading={loading}>
            Submit Request
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
