import React, { useState } from 'react'
import PasswordStrengthBar from './password_strength_bar'
import { formatFieldName } from '../../../utils'
import * as yup from 'yup'
import { passwordSchema } from '../password_schema'

interface PasswordFieldProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    placeholder: string;
    setIsPasswordValid: React.Dispatch<React.SetStateAction<boolean>>;
    error?: string;
    onBlur?: () => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    value,
    onChange,
    id,
    placeholder,
    setIsPasswordValid,
    error,
    onBlur
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        try {
            await passwordSchema.validate(e.target.value);
            setValidationError('');
            setIsPasswordValid(true);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setValidationError(err.message);
                setIsPasswordValid(false);
            }
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur();
        passwordSchema.validate(value).catch(err => {
            setValidationError(err.message);
        });
    };

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium mb-1">
                {formatFieldName(id)}
            </label>

            <input
                type={showPassword ? 'text' : 'password'}
                id={id}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10"
            />

            <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-indigo-600 cursor-pointer select-none"
            >
                {showPassword ? 'Hide' : 'Show'}
            </span>
            {(error || validationError) && (
                <p className="mt-1 text-sm text-red-600">{error || validationError}</p>
            )}
            <div className="mt-4">
                {isFocused && (
                    <>
                        <PasswordStrengthBar password={value} />
                    </>
                )}
            </div>
        </div>
    )
}

export default PasswordField
