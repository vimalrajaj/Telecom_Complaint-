import { Link, useLocation } from "wouter";
import { format } from "date-fns";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { ArrowLeft, Clock, FileText, CheckCircle, RefreshCcw, Inbox } from "lucide-react";

const getAssignment = (_id) => undefined;
const getComplaintById = (_id) => undefined;

export default function AssignmentDetails({ params }) {
  const [, setLocation] = useLocation();
  const assignment = getAssignment(params.id);

  if (!assignment) {
    return (
      <div className="text-center py-20">
        <Inbox className="mx-auto h-14 w-14 text-slate-200 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Assignment not found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The assignment <span className="font-semibold">{params.id}</span> doesn't exist or hasn't been loaded yet.
        </p>
        <Button onClick={() => setLocation("/assignments")}>Back to Assignments</Button>
      </div>
    );
  }

  const complaint = getComplaintById(assignment.complaintId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link href="/assignments" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 mb-3">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{assignment.id}</h1>
            <Badge variant="status" value={assignment.status}>{assignment.status}</Badge>
            <Badge variant="priority" value={assignment.priority}>{assignment.priority}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
            <span className="flex items-center">
              <Clock className="mr-1.5 h-4 w-4" /> Due:{" "}
              {format(new Date(assignment.dueDate), "MMM d, yyyy HH:mm")}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {assignment.status !== "Completed" && (
            <Button variant="secondary">
              <RefreshCcw className="mr-2 h-4 w-4" /> Update Status
            </Button>
          )}
          {assignment.status !== "Completed" && (
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CheckCircle className="mr-2 h-4 w-4" /> Complete Task
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" /> Task Description &amp; Notes
            </h3>
            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 text-sm whitespace-pre-wrap border border-slate-100">
              {assignment.notes}
            </div>
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Linked Complaint</h4>
              {complaint ? (
                <div
                  onClick={() => setLocation(`/complaints/${complaint.id}`)}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-indigo-600">{complaint.id}</span>
                    <Badge variant="status" value={complaint.status}>{complaint.status}</Badge>
                  </div>
                  <p className="font-medium text-slate-900 mb-1">{complaint.title}</p>
                  <p className="text-sm text-slate-500 line-clamp-2">{complaint.description}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <p className="text-sm text-slate-500">
                    Linked complaint details will appear here once loaded from the backend.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-indigo-600"
                    onClick={() => setLocation(`/complaints/${assignment.complaintId}`)}
                  >
                    View Complaint {assignment.complaintId}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-3">Assigned Engineer</h3>
            <div className="text-center py-4">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 text-2xl mb-3">
                {assignment.engineerName.charAt(0)}
              </div>
              <p className="font-medium text-slate-900 text-lg">{assignment.engineerName}</p>
              <p className="text-sm text-slate-500 mb-4">ID: {assignment.engineerId}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-left">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="block text-xs text-slate-400 mb-1">Assigned Date</span>
                  <span className="font-medium text-slate-700">{format(new Date(assignment.assignedAt), "MMM d")}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <span className="block text-xs text-slate-400 mb-1">Department</span>
                  <span className="font-medium text-slate-700">Field Ops</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
