import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputField from '../../../../common_components/input_field'
import { useVerifyResetCodeMutation } from '../../../../services/user'
import ErrorHandling from '../../../../common_components/error_handling'

const ResetPasswordConfirmForm: React.FC = () => {
    const navigate = useNavigate()

    const [code, setCode] = useState('')
    const [customError, setCustomError] = useState<string | null>(null)
    const [verifyResetCode, { isLoading, isSuccess }] =
        useVerifyResetCodeMutation()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await verifyResetCode({ code: code }).unwrap()
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
                    Enter Verification Code
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Paste the 6-digit code sent to your email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        value={code}
                        type="text"
                        handleOnChange={handleOnChange}
                        placeholder="Enter code"
                        id="Code"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>
                <ErrorHandling customError={customError} />
                {isSuccess && (
                    <p className="text-base text-green-600 font-semibold">
                        ✅ Password changed successfully! Redirecting to
                        login...
                    </p>
                )}
            </div>
        </div>
    )
}

export default ResetPasswordConfirmForm
