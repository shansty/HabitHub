import React, { useState } from 'react';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { TypeUser } from '../../types';
import { useLoginUserMutation } from '../../services/user';

const LoginForm: React.FC = () => {
    const defaultUserDataValue: TypeUser = { username: "", password: "" }
    const [userData, setUserData] = useState<TypeUser>(defaultUserDataValue);
    const [loginUser, { error, isLoading }] = useLoginUserMutation()

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { id, value } = e.target;
        setUserData((prevUser) => ({
            ...prevUser,
            [id]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await loginUser(userData).unwrap()
            const token = response.token;
        } catch (err) {
            console.error('Login failed:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Log In to HabitHub</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <InputField
                        value={userData.username}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your username'
                        id='username'
                        type='text'
                    />

                    <InputField
                        value={userData.password}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your password'
                        id='password'
                        type='password'
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-700 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Log In
                    </button>
                </form>
                {isLoading && <p>Logging in...</p>}
                {error && <p className="text-red-600">Login failed.</p>}
                <p className="mt-4 text-sm text-gray-800">
                    Forgot the password?{' '}
                    <Link to='/reset_password' className="text-indigo-600 font-medium hover:underline">Reset</Link>
                </p>
                <p className="mt-4 text-sm text-gray-800">
                    Don't have an account?{' '}
                    <Link to='/sign_up' className="text-indigo-600 font-medium hover:underline">Sign Up</Link>
                </p>
                
            </div>
        </div>
    );
};

export default LoginForm;
