import React, { useState } from 'react'
import { Info } from 'lucide-react'

interface CustomTooltipProps {
    message: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ message }) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative inline-block">
            <Info
                size={18}
                className="cursor-pointer text-indigo-600"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            />
            {visible && (
                <div className="absolute z-10 w-max max-w-xs text-sm bg-indigo-800 text-white px-3 py-2 rounded shadow-md top-full left-1/2 transform -translate-x-1/2 mt-2">
                    {message}
                </div>
            )}
        </div>
    )
}

export default CustomTooltip
