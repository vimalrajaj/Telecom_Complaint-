import { cn } from "@/lib/utils";

export default function Badge({ className, variant = "default", value = "", children, ...props }) {
  let colorClasses = "bg-slate-100 text-slate-800";

  const val = value || (typeof children === 'string' ? children : "");

  if (variant === "status") {
    switch (val.toLowerCase()) {
      case "open": colorClasses = "bg-blue-100 text-blue-700"; break;
      case "in progress": colorClasses = "bg-yellow-100 text-yellow-800"; break;
      case "assigned": colorClasses = "bg-purple-100 text-purple-700"; break;
      case "resolved":
      case "completed": colorClasses = "bg-green-100 text-green-700"; break;
      case "escalated": colorClasses = "bg-red-100 text-red-700"; break;
      case "pending": colorClasses = "bg-orange-100 text-orange-800"; break;
    }
  } else if (variant === "priority") {
    switch (val.toLowerCase()) {
      case "critical": colorClasses = "bg-red-100 text-red-700"; break;
      case "high": colorClasses = "bg-orange-100 text-orange-700"; break;
      case "medium": colorClasses = "bg-yellow-100 text-yellow-700"; break;
      case "low": colorClasses = "bg-slate-100 text-slate-600"; break;
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        colorClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
