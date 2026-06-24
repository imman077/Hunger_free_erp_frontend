import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  name?: string;
}

export const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}: AuthInputProps) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-black uppercase tracking-[0.15em]"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          name={name}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3.5 text-sm font-medium rounded-sm border transition-all duration-200 outline-none placeholder:text-[var(--text-muted)] focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};
