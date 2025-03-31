import React, { useState } from 'react';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { TypeLoginUser } from '../../types';
import { useCreateLoginUserMutation } from '../../services/user';

const LoginForm: React.FC = () => {
    const defaultUserDataValue: TypeLoginUser = { username: "", password: "" }
    const [userData, setUserData] = useState<TypeLoginUser>(defaultUserDataValue);
    const [createLoginUser] = useCreateLoginUserMutation()

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
            const response = await createLoginUser(userData).unwrap()
            console.log('User logged in:', response)
        } catch (err) {
            console.error('Login failed:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Log In to HabitHub</h2>
                <form className="space-y-4 text-left">
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
                        onSubmit={handleSubmit}
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
