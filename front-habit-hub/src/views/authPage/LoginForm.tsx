import React from 'react';
import InputField from './InputField';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const user = {
        username: "email",
        password: "password"
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Log In to HabitHub</h2>
                <form className="space-y-4 text-left">
                    <InputField
                        value={user.username}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your username'
                        id='username'
                        type='text'
                    />

                    <InputField
                        value={user.password}
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
                <p className="mt-4 text-sm text-gray-800">
                    Don't have an account?{' '}
                    <Link to='/sign_up' className="text-indigo-600 font-medium hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
