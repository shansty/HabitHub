import React, { useState } from 'react';
import InputField from './InputField';
import { Link } from 'react-router-dom';
import { TypeUser } from '../../types';
import { useCreateUserMutation } from '../../services/user';
import Dropzone from './Dropzone';

const SignUpForm: React.FC = () => {

    const defaultUserDataValue: TypeUser = { username: "", password: "", email: "" }
    const [userData, setUserData] = useState<TypeUser>(defaultUserDataValue);
    const [createUser, { error, isLoading }] = useCreateUserMutation()


    const handlePhotoDrop = (file: File) => {
        setUserData((prev) => ({ ...prev, profile_picture: file }));
    };

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
            const user = await createUser(userData).unwrap();
            console.dir({user})
        } catch (err) {
            console.error('Sign up failed:', err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-100">
            <div className="bg-white p-8 shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-6 text-indigo-700">Sign Up to HabitHub</h2>
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <Dropzone
                        onFileAccepted={handlePhotoDrop}
                        previewUrl={userData.profile_picture ? URL.createObjectURL(userData.profile_picture) : undefined}
                    />
                    <InputField
                        value={userData.username}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your username'
                        id='username'
                        type='text'
                    />

                    <InputField
                        value={userData.email}
                        handleOnChange={handleOnChange}
                        placeholder='Enter your email'
                        id='email'
                        type='email'
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
                        Sign Up
                    </button>
                </form>
                {isLoading && <p>Logging in...</p>}
                {error && <p className="text-red-600">Sign Up failed.</p>}
                <p className="mt-4 text-sm text-gray-800">
                    Already have an account?{' '}
                    <Link to='/login' className="text-indigo-600 font-medium hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};


export default SignUpForm;
