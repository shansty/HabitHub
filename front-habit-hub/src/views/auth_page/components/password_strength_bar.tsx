import React from 'react'
import { strengthData } from '../constant_data'
import { lengthSchema, numberSchema, specialCharSchema, uppercaseSchema } from '../password_schema';

interface PasswordStrengthBarProps {
    password: string
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({
    password,
}) => {
    
    const rules = {
        length: lengthSchema.isValidSync(password),
        uppercase: uppercaseSchema.isValidSync(password),
        number: numberSchema.isValidSync(password),
        special: specialCharSchema.isValidSync(password),
    };

    const score = Object.values(rules).filter((el) => Boolean(el)).length

    const { label, color, width } = strengthData[score]

    return (
        <div>
            <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
                <div className={`h-full ${color} ${width} transition-all`} />
            </div>
            <p className="text-xs text-gray-600 mt-1">{label}</p>
        </div>
    )
}

export default PasswordStrengthBar
