import { Menu, Bell, Search, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function Navbar({ toggleSidebar }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const pathParts = location.split("/").filter(Boolean);
  const title = pathParts.length > 0
    ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1)
    : "Dashboard";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6 shadow-sm z-10 relative">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-slate-500 hover:text-slate-700 md:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 hidden md:block">{title}</h2>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ID, Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-md border border-slate-300 bg-slate-50 pl-9 pr-8 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button className="relative text-slate-500 hover:text-slate-700 focus:outline-none">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 ring-1 ring-slate-200">
            {user?.name?.charAt(0) || "U"}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 md:block">
            {user?.name?.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
}
