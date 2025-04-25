import React, { useState } from 'react'
import PasswordChecklist from 'react-password-checklist'
import PasswordStrengthBar from './password_strength_bar'
import { formatFieldName } from '../../../utils'

interface PasswordFieldProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    id: string
    placeholder: string
    setIsPasswordValid: React.Dispatch<React.SetStateAction<boolean>>
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    value,
    onChange,
    id,
    placeholder,
    setIsPasswordValid,
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium mb-1">
                {formatFieldName(id)}
            </label>

            <input
                type={showPassword ? 'text' : 'password'}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10"
            />

            <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-sm text-indigo-600 cursor-pointer select-none"
            >
                {showPassword ? 'Hide' : 'Show'}
            </span>

            <div className="mt-4">
                {isFocused && (
                    <>
                        <PasswordStrengthBar password={value} />
                        <PasswordChecklist
                            rules={[
                                'minLength',
                                'specialChar',
                                'number',
                                'capital',
                            ]}
                            minLength={12}
                            value={value}
                            messages={{
                                minLength: 'At least 12 characters',
                                specialChar: 'At least one special character',
                                number: 'At least one number',
                                capital: 'At least one uppercase letter',
                            }}
                            className="text-left text-xs"
                            onChange={(isValid) => setIsPasswordValid(isValid)}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default PasswordField
