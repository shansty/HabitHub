import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVerifyEmailMutation } from '../../services/user'

const VerifyEmailPage = () => {
    const navigate = useNavigate()
    const [verifyEmail, { error, isLoading, isSuccess }] =
        useVerifyEmailMutation()
    const [isCodeExist, setIsCodeExist] = useState(true)

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code')
        if (code) {
            const verify = async () => {
                await verifyEmail(code)
            }
            verify()
        } else {
            setIsCodeExist(false)
        }
    }, [])

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [isSuccess])

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-md rounded-lg text-center max-w-md w-full">
                {isLoading && (
                    <p className="text-lg text-blue-600">
                        Verifying your email...
                    </p>
                )}

                {isSuccess && (
                    <p className="text-lg text-green-600 font-semibold">
                        ✅ Email verified! Redirecting to login...
                    </p>
                )}

                {error && 'data' in error && (
                    <p className="text-red-600 text-lg text-center mt-1">
                        {(error.data as any)?.message ||
                            '❌ Verification failed. Your link might be invalid or expired. Please try again to sign up.'}
                    </p>
                )}
                {!isCodeExist && (
                    <p className="text-red-600 text-lg text-center mt-1">
                        ❌ Verification failed. Your link might be invalid or
                        expired. Please try again to sign up.
                    </p>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage
