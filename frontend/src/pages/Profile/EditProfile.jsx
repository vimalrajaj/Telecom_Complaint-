import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { ArrowLeft, Save } from "lucide-react";

export default function EditProfile() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation("/profile");
    }, 800);
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
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Full Name</label>
                  <Input required defaultValue={user.name} />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Phone Number</label>
                  <Input required type="tel" defaultValue={user.phone} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Department</label>
                  <Input required defaultValue={user.department} />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Region</label>
                  <select required defaultValue={user.region} className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600">
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Read-Only Fields</h3>
              <p className="text-sm text-slate-500 mb-4">Contact your IT administrator to change these details.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-700 mb-1">Email Address</label>
                  <Input disabled defaultValue={user.email} className="bg-slate-50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-700 mb-1">Role</label>
                  <Input disabled defaultValue={user.role} className="bg-slate-50 cursor-not-allowed" />
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
