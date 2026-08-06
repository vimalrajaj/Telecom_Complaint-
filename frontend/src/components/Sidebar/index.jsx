import { Link, useLocation } from "wouter";
import { LayoutDashboard, AlertCircle, ClipboardList, User, LogOut, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/complaints", label: "Complaints", icon: AlertCircle },
  { href: "/assignments", label: "Assignments", icon: ClipboardList },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-slate-100 transition-transform duration-300 md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center px-6 border-b border-slate-800">
          <Activity className="h-6 w-6 text-indigo-400 mr-3" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">TeleDesk</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enterprise CMS</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <div className={cn(
                  "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}>
                  <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-slate-400")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="mb-4 flex items-center px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-medium text-white border border-slate-700">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
