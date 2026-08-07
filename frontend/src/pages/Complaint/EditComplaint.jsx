import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import { COMPLAINT_PRIORITIES } from "@/utils/constants";
import { complaintService } from "@/services/complaintService";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function EditComplaint({ params }) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM" });

  useEffect(() => {
    complaintService.getById(params.id)
      .then((res) => {
        const c = res.data;
        setForm({ title: c.title, description: c.description, priority: c.priority });
      })
      .catch(() => setError("Complaint not found."))
      .finally(() => setFetching(false));
  }, [params.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await complaintService.update(params.id, form);
      setLocation(`/complaints/${params.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="py-20 text-center text-slate-400 text-sm">Loading...</div>;

  if (error && !form.title) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">Could not find complaint #{params.id}.</p>
        <Button onClick={() => setLocation("/complaints")}>Back to Complaints</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link href={`/complaints/${params.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaint
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Edit Complaint #{params.id}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 md:p-8">
          {error && <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Title <span className="text-red-500">*</span></label>
              <Input name="title" required value={form.title} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                required
                rows={5}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium leading-6 text-slate-900 mb-1">Priority</label>
              <select
                name="priority"
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-600"
                value={form.priority}
                onChange={handleChange}
              >
                {COMPLAINT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button variant="secondary" type="button" onClick={() => setLocation(`/complaints/${params.id}`)}>Cancel</Button>
            <Button type="submit" isLoading={loading}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
