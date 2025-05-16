import React from 'react'
import { formatString } from '../utils'

interface SelectFieldProps<T = string> {
    name?: string
    value: T
    array: T[]
    handleOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    className?: string
    placeholder?: string
}

const SelectField = <T extends string>({
    value,
    handleOnChange,
    array,
    name,
    placeholder,
    className = '',
}: SelectFieldProps<T>) => {
    return (
        <select
            aria-label={placeholder}
            name={name}
            value={value}
            onChange={handleOnChange}
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${className}`}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {array.map((item) => (
                <option key={item} value={item}>
                    {formatString(item)}
                </option>
            ))}
        </select>
    )
}

export default React.memo(SelectField)
