import { Link, useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, REGIONS } from "@/utils/constants";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";

const getComplaint = (_id) => undefined;

export default function EditComplaint({ params }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const complaint = getComplaint(params.id);

  if (!complaint) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Could not find complaint <span className="font-semibold">{params.id}</span>.
        </p>
        <Link href="/complaints">
          <Button>Back to Complaints</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation(`/complaints/${complaint.id}`);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link href={`/complaints/${complaint.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaint
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Complaint {complaint.id}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 md:p-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Issue Details</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input required defaultValue={complaint.title} />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                    defaultValue={complaint.description}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select required defaultValue={complaint.category} className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600">
                      {COMPLAINT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select required defaultValue={complaint.priority} className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600">
                      {COMPLAINT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <Input required defaultValue={complaint.customerName} />
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                    Customer Phone <span className="text-red-500">*</span>
                  </label>
                  <Input required type="tel" placeholder="+91 00000 00000" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <select required defaultValue={complaint.region} className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600">
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button variant="secondary" type="button" onClick={() => setLocation(`/complaints/${complaint.id}`)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
