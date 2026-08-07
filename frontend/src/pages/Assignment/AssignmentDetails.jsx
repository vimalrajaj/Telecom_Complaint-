import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/assignmentService";
import { ASSIGNMENT_STATUSES } from "@/utils/constants";
import { ArrowLeft, Clock, FileText, Inbox } from "lucide-react";

export default function AssignmentDetails({ params }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetch = user?.role === "ENGINEER" ? assignmentService.getMine() : assignmentService.getAll();
    fetch
      .then((res) => {
        const found = (res.data || []).find((a) => String(a.id) === String(params.id));
        setAssignment(found || null);
        if (found) setSelectedStatus(found.status);
      })
      .catch(() => setError("Failed to load assignment."))
      .finally(() => setLoading(false));
  }, [params.id, user]);

  const handleUpdateStatus = async () => {
    if (!selectedStatus || selectedStatus === assignment.status) return;
    setUpdating(true);
    try {
      const res = await assignmentService.updateStatus(params.id, selectedStatus);
      setAssignment(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 text-sm">Loading...</div>;

  if (!assignment) {
    return (
      <div className="text-center py-20">
        <Inbox className="mx-auto h-14 w-14 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Assignment not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error || `Assignment #${params.id} doesn't exist.`}</p>
        <Button onClick={() => setLocation("/assignments")}>Back to Assignments</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/assignments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">Assignment #{assignment.id}</h1>
            <Badge variant="status" value={assignment.status}>{assignment.status}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center">
              <Clock className="mr-1.5 h-4 w-4" /> Assigned {format(new Date(assignment.created_at), "MMM d, yyyy HH:mm")}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" /> Linked Complaint
            </h3>
            <div
              onClick={() => setLocation(`/complaints/${assignment.complaint_id}`)}
              className="block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-indigo-600">#{assignment.complaint_id}</span>
                <Badge variant="status" value={assignment.complaint_status}>{assignment.complaint_status}</Badge>
              </div>
              <p className="font-medium text-slate-900">{assignment.complaint_title}</p>
            </div>
          </Card>

          {user?.role === "ENGINEER" && assignment.status !== "RESOLVED" && assignment.status !== "REJECTED" && (
            <Card className="p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Update Status</h3>
              <div className="flex gap-3">
                <select
                  className="flex-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {ASSIGNMENT_STATUSES.filter((s) => s !== "ASSIGNED").map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <Button onClick={handleUpdateStatus} isLoading={updating} disabled={selectedStatus === assignment.status}>
                  Update
                </Button>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Engineer</h3>
            <div className="text-center py-4">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-2xl mb-3">
                {assignment.engineer_name?.charAt(0)}
              </div>
              <p className="font-medium text-slate-900 text-lg">{assignment.engineer_name}</p>
              <p className="text-sm text-slate-500">{assignment.engineer_email}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Assigned By</h3>
            <p className="text-sm font-medium text-slate-900">{assignment.assigned_by_name}</p>
            <p className="text-xs text-slate-500 mt-1">{format(new Date(assignment.created_at), "MMM d, yyyy")}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
