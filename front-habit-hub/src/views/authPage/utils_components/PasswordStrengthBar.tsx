import React from 'react';

interface PasswordStrengthBarProps {
    password: string;
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
    const rules = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(rules).filter((el => Boolean(el))).length;

    const strengthData = [
        { label: 'Too weak', color: 'bg-red-500', width: 'w-[5%]' },
        { label: 'Weak', color: 'bg-orange-400', width: 'w-1/4' },
        { label: 'Fair', color: 'bg-yellow-400', width: 'w-1/2' },
        { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' },
        { label: 'Strong', color: 'bg-green-500', width: 'w-full' },
    ];

    const { label, color, width } = strengthData[score];


    return (
        <div>
            <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} ${width} transition-all`}
                />
            </div>
            <p className="text-xs text-gray-600 mt-1">{label}</p>
        </div>
    );
};

export default PasswordStrengthBar;
