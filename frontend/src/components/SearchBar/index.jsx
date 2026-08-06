import { Search, X } from "lucide-react";
import Input from "@/components/Input";
import { cn } from "@/lib/utils";

export default function SearchBar({ value, onChange, onClear, containerClassName, className, ...props }) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        className={cn("pl-9 pr-9", className)}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
