import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { User, Mail, Phone, CalendarDays, Shield, Edit } from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile()
      .then((res) => {
        setProfile(res.data);
        setUser(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const data = profile || user;
  if (loading) return <div className="py-20 text-center text-slate-400 text-sm">Loading...</div>;
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <Button onClick={() => setLocation("/profile/edit")}>
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-6 text-center border-t-4 border-t-indigo-600">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 text-3xl font-bold text-indigo-700 ring-4 ring-white shadow-md border border-indigo-100 mb-4">
              {data.name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{data.name}</h2>
            <p className="text-sm font-medium text-indigo-600 mt-1">{data.role}</p>
            <div className="mt-6 flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-center text-slate-600">
                <Shield className="mr-2 h-4 w-4 text-slate-400" />
                ID: <span className="font-medium text-slate-900 ml-1">#{data.id}</span>
              </div>
              <div className="flex items-center justify-center text-slate-600">
                <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                Joined: <span className="font-medium text-slate-900 ml-1">{format(new Date(data.created_at), "MMM yyyy")}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <Mail className="mr-2 h-4 w-4" /> Email Address
                </label>
                <p className="font-medium text-slate-900">{data.email}</p>
              </div>
              <div>
                <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <Phone className="mr-2 h-4 w-4" /> Phone Number
                </label>
                <p className="font-medium text-slate-900">{data.phone || "—"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <User className="mr-2 h-4 w-4" /> Role
                </label>
                <p className="font-medium text-slate-900">{data.role}</p>
              </div>
              <div>
                <label className="flex items-center text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  <CalendarDays className="mr-2 h-4 w-4" /> Last Updated
                </label>
                <p className="font-medium text-slate-900">{format(new Date(data.updated_at), "MMM d, yyyy")}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
