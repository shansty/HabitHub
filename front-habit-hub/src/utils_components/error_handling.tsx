import React from "react";
interface ErrorHandlingProps {
    customError: string | null
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ customError }) => {
    if (!customError) return null
    return (<>
        <p className="text-red-600 text-sm text-center mt-1">
            {customError || "Something went wrong. Please try again."}
        </p>
    </>
    );
}

export default ErrorHandling;
