import React, { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// Usamos forwardRef para que react-hook-form pueda registrar el input correctamente
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          ref={ref} // Importante para react-hook-form
          type={showPassword ? "text" : "password"}
          onChange={onChange} // Permite que react-hook-form maneje el cambio
          className="w-full p-3 border border-gray-300 rounded pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default PasswordInput;
