import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { assignmentService } from "@/services/assignmentService";
import { ASSIGNMENT_STATUSES } from "@/utils/constants";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Filter, ArrowUpDown, Inbox } from "lucide-react";

export default function AssignmentList() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetch = user?.role === "ENGINEER" ? assignmentService.getMine() : assignmentService.getAll();
    fetch
      .then((res) => setAssignments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchSearch =
        a.complaint_title?.toLowerCase().includes(search.toLowerCase()) ||
        String(a.id).includes(search);
      const matchStatus = statusFilter ? a.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [assignments, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
          <p className="text-slate-500 mt-1">Track task allocations and field engineer workloads.</p>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            placeholder="Search assignments..."
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
              {ASSIGNMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]"><div className="flex items-center">ID <ArrowUpDown className="ml-1 h-3 w-3" /></div></TableHead>
              <TableHead>Complaint</TableHead>
              {user?.role === "ADMIN" && <TableHead>Engineer</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="h-48 text-center text-slate-400 text-sm">Loading...</TableCell></TableRow>
            ) : paginated.length > 0 ? (
              paginated.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium text-indigo-600">#{a.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 truncate max-w-[200px]">{a.complaint_title}</div>
                    <Link href={`/complaints/${a.complaint_id}`} className="text-xs text-indigo-600 hover:underline mt-0.5 inline-block">
                      #{a.complaint_id}
                    </Link>
                  </TableCell>
                  {user?.role === "ADMIN" && (
                    <TableCell className="text-slate-600">
                      <span className="inline-flex items-center">
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center mr-2 font-medium text-slate-700">
                          {a.engineer_name?.charAt(0)}
                        </div>
                        {a.engineer_name}
                      </span>
                    </TableCell>
                  )}
                  <TableCell><Badge variant="status" value={a.status}>{a.status}</Badge></TableCell>
                  <TableCell className="text-slate-600">{format(new Date(a.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/assignments/${a.id}`)}>View</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">{search || statusFilter ? "No assignments match your filters." : "No assignments yet."}</p>
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
