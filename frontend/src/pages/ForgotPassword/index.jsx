import { useState } from "react";
import { Link } from "wouter";
import { Activity, ArrowLeft, CheckCircle2 } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
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
            Reset your password
          </h2>
        </div>

        {submitted ? (
          <div className="mt-8 rounded-xl bg-green-50 p-6 text-center border border-green-100">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-medium text-green-900">Check your email</h3>
            <p className="mt-2 text-sm text-green-700">
              We sent a password reset link to <span className="font-semibold">{email}</span>
            </p>
            <div className="mt-6">
              <Link href="/login" className="text-sm font-medium text-green-800 hover:text-green-900 underline underline-offset-4">
                Return to sign in
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-slate-500 mt-2">
              Enter your work email address and we'll send you a link to reset your password.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900">Work Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                Send reset link
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
