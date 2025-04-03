import React, { useState } from 'react';
import { formatFieldName } from '../../../utils';

interface InputFieldProps {
  value?: string;
  handleOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  id: string;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({ value, handleOnChange, type, id, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {formatFieldName(id)}
      </label>
      <input
        type={isPassword && showPassword ? 'text' : type}
        id={id}
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10"
      />
      {isPassword && (
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-sm text-indigo-600 cursor-pointer"
        >
          {showPassword ? 'Hide' : 'Show'}
        </span>
      )}
    </div>
  );
};

export default InputField;
