import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeResetPasswordCredentials } from '../../../types';
import { useResetPasswordMutation } from '../../../services/user';
import PasswordField from '../components/PasswordField';
import InputField from '../../../utils_components/InputField';
import ErrorHandling from '../../../utils_components/ErrorHandling';

const ResetPasswordForm = () => {

    const [userData, setUserData] = useState<TypeResetPasswordCredentials>({
        email: "",
        new_password: "",
        confirm_password: ""
    })
    const [, setIsPasswordValid] = useState(false);
    const [customError, setCustomError] = useState<string | null>(null);
    const [resetPassword, { isLoading }] = useResetPasswordMutation()
    const navigate = useNavigate();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        setUserData((prevUser) => ({
            ...prevUser,
            [id]: value,
        }));
        setCustomError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userData.email.trim()) {
            setCustomError("Email is required")
            return;
        };
        if (!userData.new_password.trim()){
            setCustomError("New password is required")
            return
        } 
        if (!userData.confirm_password.trim()) {
            setCustomError("You need to confirm password.");
            return;
        }
        if (userData.new_password !== userData.confirm_password) {
            setCustomError("Passwords do not match.");
            return;
        };

        if (userData.confirm_password === userData.new_password) {
            try {
                const res = await resetPassword(userData).unwrap();
                if (res.success) {
                    navigate('/confirm_reset_password')
                }
            } catch (err: any) {
                setCustomError(err?.data?.message);
            }
        };
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

                    <button
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Reset
                    </button>
                </form>
                <ErrorHandling customError={customError} />
                {isLoading && <p>Please wait...</p>}
            </div>
        </div>
    );
}

export default ResetPasswordForm;
