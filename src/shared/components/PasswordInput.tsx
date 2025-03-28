import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ error, onChange, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Estado interno para manejar el valor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e); // Llamamos a onChange si existe
  };

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded pr-10"
      />
      {inputValue && ( // Solo muestra el botón si hay texto en el input
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;
