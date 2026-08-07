import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { complaintService } from "@/services/complaintService";
import { commentService } from "@/services/commentService";
import { assignmentService } from "@/services/assignmentService";
import { userService } from "@/services/userService";
import { ArrowLeft, Edit, MessageSquare, Send, Clock, User, Trash2, UserPlus } from "lucide-react";

export default function ComplaintDetails({ params }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const requests = [
      complaintService.getById(params.id),
      commentService.getAll(params.id),
    ];
    if (user?.role === "ADMIN") requests.push(userService.getEngineers());

    Promise.all(requests)
      .then(([cRes, cmRes, engRes]) => {
        setComplaint(cRes.data);
        setComments(cmRes.data || []);
        if (engRes) setEngineers(engRes.data || []);
      })
      .catch(() => setError("Failed to load complaint."))
      .finally(() => setLoading(false));
  }, [params.id, user]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentService.add(params.id, commentText);
      setComments([...comments, res.data]);
      setCommentText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this complaint?")) return;
    try {
      await complaintService.remove(params.id);
      setLocation("/complaints");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssign = async () => {
    if (!selectedEngineer) return;
    setAssigning(true);
    try {
      await assignmentService.create(complaint.id, parseInt(selectedEngineer));
      const res = await complaintService.getById(params.id);
      setComplaint(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-slate-400 text-sm">Loading...</div>;

  if (!complaint) {
    return (
      <div className="text-center py-20">
        <MessageSquare className="mx-auto h-14 w-14 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error || `Complaint #${params.id} doesn't exist.`}</p>
        <Button onClick={() => setLocation("/complaints")}>Back to Complaints</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/complaints" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">#{complaint.id}</h1>
            <Badge variant="status" value={complaint.status}>{complaint.status}</Badge>
            <Badge variant="priority" value={complaint.priority}>{complaint.priority}</Badge>
          </div>
          <h2 className="text-lg text-slate-700">{complaint.title}</h2>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center">
              <Clock className="mr-1.5 h-4 w-4" />
              Created {format(new Date(complaint.created_at), "MMM d, yyyy HH:mm")}
            </span>
          </div>
        </div>
        {user?.role === "CUSTOMER" && complaint.status === "OPEN" && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setLocation(`/complaints/${complaint.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        )}
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Description</h3>
            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
              {complaint.description}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="mr-2 h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">Comments</h3>
            </div>
            {comments.length > 0 ? (
              <div className="space-y-6 mb-6">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {c.user_name?.charAt(0) ?? "U"}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">{c.user_name}</h4>
                        <span className="text-xs text-slate-500">{format(new Date(c.created_at), "MMM d, HH:mm")}</span>
                      </div>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 py-6 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm">No comments yet.</p>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 border border-indigo-200">
                {user?.name?.charAt(0) ?? "U"}
              </div>
              <div className="relative flex-1">
                <textarea
                  rows={3}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim() || submitting} isLoading={submitting}>
                    <Send className="mr-2 h-4 w-4" /> Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer</span>
                <span className="font-medium text-slate-900">{complaint.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-900 text-xs">{complaint.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge variant="status" value={complaint.status}>{complaint.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority</span>
                <Badge variant="priority" value={complaint.priority}>{complaint.priority}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-medium text-slate-900">{format(new Date(complaint.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Assignment</h3>
            {complaint.status === "OPEN" && user?.role === "ADMIN" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Assign an engineer to this complaint.</p>
                <select
                  className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
                  value={selectedEngineer}
                  onChange={(e) => setSelectedEngineer(e.target.value)}
                >
                  <option value="">Select engineer...</option>
                  {engineers.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <Button className="w-full" onClick={handleAssign} isLoading={assigning} disabled={!selectedEngineer}>
                  <UserPlus className="mr-2 h-4 w-4" /> Assign Engineer
                </Button>
              </div>
            ) : complaint.status === "OPEN" ? (
              <div className="text-center py-4">
                <User className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">No engineer assigned yet.</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Status: <span className="font-medium text-slate-900">{complaint.status}</span></p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
