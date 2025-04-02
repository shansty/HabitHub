import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../services/user';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState<string | null>(null);
    const [verifyEmail, { error, isLoading, isSuccess }] = useVerifyEmailMutation();

    useEffect(() => {
        const urlCode = new URLSearchParams(window.location.search).get('code');
        setCode(urlCode);
        const verify = async () => {
            if (!urlCode) return;
            try {
                await verifyEmail(urlCode).unwrap();
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                console.error('Verification failed:', err);
            }
        };
        verify();
    }, []);



    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-md rounded-lg text-center max-w-md w-full">
                {isLoading && <p className="text-lg text-blue-600">Verifying your email...</p>}

                {isSuccess && (
                    <p className="text-lg text-green-600 font-semibold">
                        ✅ Email verified! Redirecting to login...
                    </p>
                )}

                {error && (
                    <p className="text-lg text-red-600 font-semibold">
                        ❌ Verification failed. Your link might be invalid or expired
                    </p>
                )}

                {!code && (
                    <p className="text-lg text-gray-700">
                        No verification code found in URL.
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
