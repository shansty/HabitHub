import React from 'react';

interface InputNumberProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  className?: string;
  onBlur?: () => void;
}

const InputNumber: React.FC<InputNumberProps> = ({ name, value, onChange, min = 1, onBlur,  className = '',  }) => {
  return (
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      min={min}
      className={`border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
    />
  );
};

export default InputNumber;
