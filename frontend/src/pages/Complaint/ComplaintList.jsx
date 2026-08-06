import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, REGIONS } from "@/utils/constants";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Plus, Filter, ArrowUpDown, Inbox } from "lucide-react";

const complaints = [];

export default function ComplaintList() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? c.status === statusFilter : true;
      const matchesPriority = priorityFilter ? c.priority === priorityFilter : true;
      const matchesCategory = categoryFilter ? c.category === categoryFilter : true;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-slate-500 mt-1">Manage and track customer service issues.</p>
        </div>
        <Button onClick={() => setLocation("/complaints/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Complaint
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            placeholder="Search by ID or Title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            onClear={() => { setSearch(""); setPage(1); }}
            containerClassName="w-full md:w-80"
          />
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center text-sm font-medium text-slate-500 mr-2">
              <Filter className="h-4 w-4 mr-2" /> Filters:
            </div>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
            </select>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Priorities</option>
              {COMPLAINT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {COMPLAINT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] cursor-pointer hover:bg-slate-100">
                <div className="flex items-center">ID <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </TableHead>
              <TableHead>Title &amp; Customer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Engineer</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedComplaints.length > 0 ? (
              paginatedComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium text-slate-900">{complaint.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 truncate max-w-[250px]">{complaint.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{complaint.customerName}</div>
                  </TableCell>
                  <TableCell className="text-slate-600">{complaint.category}</TableCell>
                  <TableCell>
                    <Badge variant="status" value={complaint.status}>{complaint.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="priority" value={complaint.priority}>{complaint.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {complaint.assignedEngineer ? (
                      <span className="inline-flex items-center">
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center mr-2 font-medium text-slate-700">
                          {complaint.assignedEngineer.charAt(0)}
                        </div>
                        {complaint.assignedEngineer}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/complaints/${complaint.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-48 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">
                      {search || statusFilter || priorityFilter || categoryFilter
                        ? "No complaints match your filters."
                        : "No complaints yet."}
                    </p>
                    {!(search || statusFilter || priorityFilter || categoryFilter) && (
                      <p className="text-xs mt-1">Create a new complaint to get started.</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredComplaints.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredComplaints.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Card>
    </div>
  );
}
