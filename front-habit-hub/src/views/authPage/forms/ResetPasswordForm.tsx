import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeResetPasswordCredentials } from '../../../types';
import { useResetPasswordMutation } from '../../../services/user';
import PasswordField from '../utils_components/PasswordField';
import InputField from '../utils_components/InputField';

const ResetPasswordForm = () => {

    const [userData, setUserData] = useState<TypeResetPasswordCredentials>({
        email: "",
        new_password: "",
        confirm_password: ""
    })
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordsEqual, setIsPasswordsEqual] = useState(false)
    const [isShowMessage, setIsShowMessage] = useState(true)
    const [resetPassword, { error, isLoading }] = useResetPasswordMutation()
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.confirm_password === userData.new_password) {
            setIsPasswordsEqual(true)
            setIsShowMessage(false)
        } else {
            setIsPasswordsEqual(false)
            setIsShowMessage(true)
        }
    }, [userData.confirm_password, userData.new_password])

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        setUserData((prevUser) => ({
            ...prevUser,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (userData.confirm_password === userData.new_password) {
                const res = await resetPassword(userData).unwrap();
                if (res.success) {
                    navigate('/confirm_reset_password')
                }
            }
        } catch (err) {
            console.error("Password reseting failed.:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Reset password</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">

                    <InputField
                        type='email'
                        value={userData.email}
                        handleOnChange={handleOnChange}
                        id="email"
                        placeholder="Enter your email"
                    />

                    <PasswordField
                        value={userData.new_password}
                        onChange={handleOnChange}
                        id="new_password"
                        placeholder="Enter new password"
                        setIsPasswordValid={setIsPasswordValid}
                    />

                    <InputField
                        type='password'
                        value={userData.confirm_password}
                        handleOnChange={handleOnChange}
                        id="confirm_password"
                        placeholder="Confirm new password"
                    />

                    {isShowMessage && <p className='text-xs text-red-600'>New password and confirmation do not match. Please try again.</p>}

                    <button
                        disabled={!isPasswordValid || !isPasswordsEqual}
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Reset
                    </button>
                </form>
                {error && 'data' in error && (
                    <p className="text-red-600 text-sm text-center mt-1">
                        {(error.data as any)?.message || 'Something went wrong. Please try again.'}
                    </p>
                )}
                {isLoading && <p>Please wait...</p>}
            </div>
        </div>
    );
}

export default ResetPasswordForm;
