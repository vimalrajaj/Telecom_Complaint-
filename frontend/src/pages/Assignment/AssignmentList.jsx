import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";
import Pagination from "@/components/Pagination";
import { format } from "date-fns";
import { Filter, ArrowUpDown, Inbox } from "lucide-react";

const assignments = [];

export default function AssignmentList() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [engineerFilter, setEngineerFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch =
        a.complaintTitle.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? a.status === statusFilter : true;
      const matchesEngineer = engineerFilter ? a.engineerName === engineerFilter : true;
      return matchesSearch && matchesStatus && matchesEngineer;
    });
  }, [search, statusFilter, engineerFilter]);

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const paginatedAssignments = filteredAssignments.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const engineers = [...new Set(assignments.map((a) => a.engineerName))];

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
            placeholder="Search tasks..."
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
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-600"
              value={engineerFilter}
              onChange={(e) => { setEngineerFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Engineers</option>
              {engineers.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] cursor-pointer hover:bg-slate-100">
                <div className="flex items-center">ID <ArrowUpDown className="ml-1 h-3 w-3" /></div>
              </TableHead>
              <TableHead>Complaint</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAssignments.length > 0 ? (
              paginatedAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium text-slate-900">{assignment.id}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 truncate max-w-[200px]">{assignment.complaintTitle}</div>
                    <Link href={`/complaints/${assignment.complaintId}`} className="text-xs text-indigo-600 hover:underline mt-0.5 inline-block">
                      {assignment.complaintId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    <span className="inline-flex items-center">
                      <div className="h-5 w-5 rounded-full bg-slate-200 text-[10px] flex items-center justify-center mr-2 font-medium text-slate-700">
                        {assignment.engineerName.charAt(0)}
                      </div>
                      {assignment.engineerName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="status" value={assignment.status}>{assignment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="priority" value={assignment.priority}>{assignment.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary" size="sm" onClick={() => setLocation(`/assignments/${assignment.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center text-slate-400">
                    <Inbox className="h-10 w-10 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">
                      {search || statusFilter || engineerFilter ? "No assignments match your filters." : "No assignments yet."}
                    </p>
                    {!(search || statusFilter || engineerFilter) && (
                      <p className="text-xs mt-1">Assignments will appear here once complaints are assigned to engineers.</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {filteredAssignments.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={filteredAssignments.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Card>
    </div>
  );
}
