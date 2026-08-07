import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useLocation, Link } from "wouter";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Plus, ListTodo, FileText, Inbox } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { complaintService } from "@/services/complaintService";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintService.getAll()
      .then((res) => setComplaints(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "OPEN").length,
    inProgress: complaints.filter((c) => c.status === "IN_PROGRESS" || c.status === "ACCEPTED").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED").length,
  };

  const priorityCounts = ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => ({
    name: p,
    complaints: complaints.filter((c) => c.priority === p).length,
  }));

  const recentComplaints = [...complaints].slice(0, 5);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-slate-500 mt-1">Here's your operations overview for today.</p>
        </div>
        {user?.role === "CUSTOMER" && (
          <Button onClick={() => setLocation("/complaints/new")} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Complaint
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Complaints</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg"><ListTodo className="h-6 w-6 text-indigo-600" /></div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-slate-400 ml-1">All time</span>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Open</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.open}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg"><AlertCircle className="h-6 w-6 text-red-600" /></div>
          </div>
          <div className="mt-4 text-sm text-slate-400">Awaiting action</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg"><Clock className="h-6 w-6 text-yellow-600" /></div>
          </div>
          <div className="mt-4 text-sm text-slate-500">Actively being worked on</div>
        </Card>

        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Resolved</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg"><CheckCircle2 className="h-6 w-6 text-emerald-600" /></div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-slate-400 ml-1">All time</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Complaints by Priority</h3>
            {complaints.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    <Bar dataKey="complaints" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-slate-400">
                <FileText className="h-10 w-10 mb-3 text-slate-300" />
                <p className="text-sm">No data available yet.</p>
              </div>
            )}
          </Card>

          <Card className="overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Recent Complaints</h3>
              <Button variant="ghost" size="sm" onClick={() => setLocation("/complaints")} className="text-indigo-600 hover:text-indigo-700">View All</Button>
            </div>
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-sm">Loading...</div>
            ) : recentComplaints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-medium">ID</th>
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Priority</th>
                      <th className="px-5 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {recentComplaints.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          <Link href={`/complaints/${c.id}`} className="hover:underline text-indigo-600">#{c.id}</Link>
                        </td>
                        <td className="px-5 py-3 text-slate-700 truncate max-w-[200px]">{c.title}</td>
                        <td className="px-5 py-3"><Badge variant="status" value={c.status}>{c.status}</Badge></td>
                        <td className="px-5 py-3"><Badge variant="priority" value={c.priority}>{c.priority}</Badge></td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(c.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center text-slate-400">
                <Inbox className="h-10 w-10 mb-3 text-slate-300" />
                <p className="text-sm font-medium">No complaints yet</p>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Priority Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: "Critical", color: "bg-red-500", key: "CRITICAL" },
                { label: "High", color: "bg-orange-500", key: "HIGH" },
                { label: "Medium", color: "bg-yellow-500", key: "MEDIUM" },
                { label: "Low", color: "bg-slate-400", key: "LOW" },
              ].map((item) => {
                const count = complaints.filter((c) => c.priority === item.key).length;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{item.label}</span>
                      <span className="text-slate-900 font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
