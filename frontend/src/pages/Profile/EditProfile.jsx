import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "",
  });

  if (!user) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const res = await userService.updateProfile(payload);
      setUser(res.data);
      setLocation("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link href="/profile" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 md:p-8">
          {error && <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Full Name</label>
                  <Input name="name" required value={form.name} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Phone Number</label>
                  <Input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10 digits" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Change Password</h3>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
                <Input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Read-Only Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-700 mb-1">Email Address</label>
                  <Input disabled value={user.email} className="bg-slate-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-700 mb-1">Role</label>
                  <Input disabled value={user.role} className="bg-slate-50 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button variant="secondary" type="button" onClick={() => setLocation("/profile")}>Cancel</Button>
            <Button type="submit" isLoading={loading}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
