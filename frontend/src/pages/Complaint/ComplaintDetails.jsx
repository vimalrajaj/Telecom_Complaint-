import { useState } from "react";
import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, Edit, AlertTriangle, CheckCircle2, UserPlus,
  MessageSquare, Send, Clock, User, MapPin, Tag, Phone
} from "lucide-react";

const getComplaint = (_id) => undefined;
const getAssignment = (_complaintId) => undefined;

export default function ComplaintDetails({ params }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const complaint = getComplaint(params.id);
  const assignment = getAssignment(params.id);

  if (!complaint) {
    return (
      <div className="text-center py-20">
        <MessageSquare className="mx-auto h-14 w-14 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Complaint not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The complaint <span className="font-semibold">{params.id}</span> doesn't exist or hasn't been loaded yet.
        </p>
        <Button onClick={() => setLocation("/complaints")}>Back to Complaints</Button>
      </div>
    );
  }

  const handleResolve = () => setResolveModalOpen(false);
  const handleEscalate = () => setEscalateModalOpen(false);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), author: user?.name || "You", text: commentText, time: new Date().toISOString() },
    ]);
    setCommentText("");
  };

  const authorInitial = user?.name?.charAt(0) ?? "U";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/complaints" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Complaints
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{complaint.id}</h1>
            <Badge variant="status" value={complaint.status}>{complaint.status}</Badge>
            <Badge variant="priority" value={complaint.priority}>{complaint.priority}</Badge>
          </div>
          <h2 className="text-lg text-slate-700">{complaint.title}</h2>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center">
              <Clock className="mr-1.5 h-4 w-4" />
              Created {format(new Date(complaint.createdAt), "MMM d, yyyy HH:mm")}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setLocation(`/complaints/${complaint.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="secondary">
            <UserPlus className="mr-2 h-4 w-4" /> Reassign
          </Button>
          <Button variant="danger" onClick={() => setEscalateModalOpen(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" /> Escalate
          </Button>
          {complaint.status !== "Resolved" && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setResolveModalOpen(true)}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Description</h3>
            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
              {complaint.description}
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Classification</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Tag className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 w-24">Category:</span>
                    <span className="font-medium text-slate-900">{complaint.category}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 w-24">Region:</span>
                    <span className="font-medium text-slate-900">{complaint.region}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Customer Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <User className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 w-24">Name:</span>
                    <span className="font-medium text-slate-900">{complaint.customerName}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Tag className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 w-24">Customer ID:</span>
                    <span className="font-medium text-slate-900">{complaint.customerId}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-3 h-4 w-4 text-slate-400" />
                    <span className="text-slate-600 w-24">Contact:</span>
                    <span className="font-medium italic text-slate-400">—</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center mb-6">
              <MessageSquare className="mr-2 h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">Activity &amp; Comments</h3>
            </div>
            {comments.length > 0 ? (
              <div className="space-y-6 mb-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-900">{comment.author}</h4>
                        <span className="text-xs text-slate-500">{format(new Date(comment.time), "MMM d, HH:mm")}</span>
                      </div>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 py-6 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm">No comments yet. Be the first to add a note.</p>
              </div>
            )}
            <div className="mt-4 flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 border border-indigo-200">
                {authorInitial}
              </div>
              <div className="relative flex-1">
                <textarea
                  rows={3}
                  placeholder="Add an internal note or comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 resize-none"
                />
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim()}>
                    <Send className="mr-2 h-4 w-4" /> Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Assignment</h3>
            {complaint.assignedEngineer ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-lg mr-4">
                    {complaint.assignedEngineer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{complaint.assignedEngineer}</p>
                    <p className="text-xs text-slate-500">Field Engineer</p>
                  </div>
                </div>
                {assignment && (
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mt-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Assignment ID</span>
                      <Link href={`/assignments/${assignment.id}`} className="font-medium text-indigo-600 hover:underline">
                        {assignment.id}
                      </Link>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Due Date</span>
                      <span className="font-medium text-slate-900">{format(new Date(assignment.dueDate), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <User className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="text-sm text-slate-500 mb-4">No engineer currently assigned to this issue.</p>
                <Button variant="secondary" size="sm" className="w-full">Assign Engineer</Button>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Timeline</h3>
            <div className="relative border-l border-slate-200 ml-3 space-y-6 mt-4">
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-indigo-500 ring-2 ring-slate-100" />
                <p className="text-sm font-medium text-slate-900">Ticket Opened</p>
                <p className="text-xs text-slate-500 mt-1">{format(new Date(complaint.createdAt), "MMM d, yyyy HH:mm")}</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-2 ring-slate-100" />
                <p className="text-sm font-medium text-slate-900">Assigned to {complaint.assignedEngineer || "Network Team"}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {format(new Date(new Date(complaint.createdAt).getTime() + 3600000), "MMM d, yyyy HH:mm")}
                </p>
              </div>
              <div className="relative pl-6">
                <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-slate-300 ring-2 ring-slate-100" />
                <p className="text-sm font-medium text-slate-900">Current Status: {complaint.status}</p>
                <p className="text-xs text-slate-500 mt-1">Pending update</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={resolveModalOpen} onClose={() => setResolveModalOpen(false)} title="Mark Complaint as Resolved">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to mark <span className="font-semibold text-slate-900">{complaint.id}</span> as resolved?
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Resolution Notes (Optional)</label>
            <textarea className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none" rows={3} placeholder="Detail how the issue was fixed..." />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setResolveModalOpen(false)}>Cancel</Button>
            <Button onClick={handleResolve} className="bg-emerald-600 hover:bg-emerald-700 text-white">Confirm Resolution</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={escalateModalOpen} onClose={() => setEscalateModalOpen(false)} title="Escalate Complaint">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Escalating <span className="font-semibold text-slate-900">{complaint.id}</span> will raise its priority and notify the L2 support team.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">Escalation Reason</label>
            <select className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600">
              <option>SLA breached</option>
              <option>Requires specialist intervention</option>
              <option>Widespread outage</option>
              <option>Customer requested escalation</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" onClick={() => setEscalateModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleEscalate}>Escalate Now</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
