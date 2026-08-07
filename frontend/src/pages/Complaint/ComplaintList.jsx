import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { COMPLAINT_PRIORITIES, COMPLAINT_STATUSES } from "@/utils/constants";
import { complaintService } from "@/services/complaintService";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Plus, Filter, ArrowUpDown, Inbox } from "lucide-react";

export default function ComplaintList() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    complaintService.getAll()
      .then((res) => setComplaints(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || String(c.id).includes(search);
      const matchStatus = statusFilter ? c.status === statusFilter : true;
      const matchPriority = priorityFilter ? c.priority === priorityFilter : true;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints</h1>
          <p className="text-slate-500 mt-1">Manage and track customer service issues.</p>
        </div>
        {user?.role === "CUSTOMER" && (
          <Button onClick={() => setLocation("/complaints/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Complaint
          </Button>
        )}
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
              {COMPLAINT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Priorities</option>
              {COMPLAINT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"><div className="flex items-center">ID <ArrowUpDown className="ml-1 h-3 w-3" /></div></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="h-48 text-center text-slate-400 text-sm">Loading...</TableCell></TableRow>
            ) : paginated.length > 0 ? (
              paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-indigo-600">#{c.id}</TableCell>
                  <TableCell className="font-medium text-slate-900 truncate max-w-[220px]">{c.title}</TableCell>
                  <TableCell className="text-slate-600">{c.customer_name}</TableCell>
                  <TableCell><Badge variant="status" value={c.status}>{c.status}</Badge></TableCell>
                  <TableCell><Badge variant="priority" value={c.priority}>{c.priority}</Badge></TableCell>
                  <TableCell className="text-slate-600">{format(new Date(c.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/complaints/${c.id}`)}>View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">{search || statusFilter || priorityFilter ? "No complaints match your filters." : "No complaints yet."}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filtered.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} itemsPerPage={itemsPerPage} />
        )}
      </Card>
    </div>
  );
}
